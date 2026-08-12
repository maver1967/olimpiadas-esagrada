const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const ip = require('ip');
const QRCode = require('qrcode');
const cors = require('cors');

const db = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || "1234";

app.use(cors());
app.use(express.json());
// Serve static files da public com Headers anti-cache per HTML
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Indirizzo IP e QR Code (Rilevamento Cloud / Intranet)
let localIpAddress = ip.address();
let serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL || `http://${localIpAddress}:${PORT}`;
let teamQrCodeUrl = '';

function generateQrCode() {
  QRCode.toDataURL(`${serverUrl}/team.html`, { margin: 2, scale: 8 }, (err, url) => {
    if (!err) teamQrCodeUrl = url;
  });
}
generateQrCode();

// Stato Globale del Gioco in Tempo Reale
let gameState = {
  status: 'LOBBY', // 'LOBBY', 'QUESTION_ACTIVE', 'VOTING_CLOSED', 'REVEAL_ANSWER', 'ROUND_RESULTS', 'TOURNAMENT_LEADERBOARD'
  activeChallengeId: null,
  activeChallengeTitle: 'Nenhum desafio activo',
  activeWeekId: null,
  activeWeekName: '',
  questions: [],
  currentQuestionIndex: 0,
  activeQuestion: null,
  completedQuestionIds: [], // IDs das perguntas já realizadas e avaliadas
  timerSeconds: 15,
  timerMax: 15,
  timerInterval: null,
  responses: {}, // { teamId: { option: 'A', isCorrect: true/false, responseTime: 5.2 } }
  connectedTeams: {}, // { socketId: { id, name, color } }
};

// Reset temporaneo timer
function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

// Avvio del timer di 15 secondi lato server
function startQuestionTimer(duration = 15) {
  stopTimer();
  gameState.timerMax = duration;
  gameState.timerSeconds = duration;

  io.emit('timer_tick', {
    seconds: gameState.timerSeconds,
    max: gameState.timerMax,
    isWarning: gameState.timerSeconds <= 5
  });

  gameState.timerInterval = setInterval(async () => {
    gameState.timerSeconds -= 1;

    io.emit('timer_tick', {
      seconds: gameState.timerSeconds,
      max: gameState.timerMax,
      isWarning: gameState.timerSeconds <= 5
    });

    if (gameState.timerSeconds <= 0) {
      stopTimer();
      // 1. Scaduto il tempo: Votazione Chiusa (2 secondi)
      gameState.status = 'VOTING_CLOSED';
      io.emit('game_state_update', buildPublicGameState());

      // 2. Dopo 2 secondi: Mostra Risposta Corretta + Chi ha indovinato e chi ha sbagliato (5 secondi)
      setTimeout(async () => {
        gameState.status = 'REVEAL_ANSWER';
        if (gameState.activeQuestion && !gameState.completedQuestionIds.includes(gameState.activeQuestion.id)) {
          gameState.completedQuestionIds.push(gameState.activeQuestion.id);
        }
        io.emit('game_state_update', buildPublicGameState());

        // Calcola e salva i punteggi del round
        await processRoundResults();

        // 3. Após 5 segundos: Mostra a Classificação e avança automaticamente para a próxima pergunta no Admin
        setTimeout(async () => {
          if (gameState.status === 'REVEAL_ANSWER') {
            gameState.status = 'ROUND_RESULTS';
            
            // Avança automaticamente a pergunta activa no Admin para a próxima pergunta por realizar
            if (gameState.questions && gameState.questions.length > 0) {
              let nextIndex = gameState.currentQuestionIndex + 1;
              while (nextIndex < gameState.questions.length && gameState.completedQuestionIds.includes(gameState.questions[nextIndex].id)) {
                nextIndex++;
              }
              if (nextIndex < gameState.questions.length) {
                gameState.currentQuestionIndex = nextIndex;
                gameState.activeQuestion = gameState.questions[nextIndex];
              }
            }

            const leaderboard = await db.getChallengeLeaderboard(gameState.activeChallengeId);
            const overall = await db.getOverallTournamentLeaderboard();
            io.emit('game_state_update', buildPublicGameState());
            io.emit('leaderboard_update', { challenge: leaderboard, overall });
          }
        }, 5000);

      }, 2000);
    }
  }, 1000);
}

// Elabora le risposte ricevute per il round corrente (1 ponto por resposta certa, 0 por errada)
async function processRoundResults() {
  if (!gameState.activeQuestion || !gameState.activeChallengeId) return;

  const currentQ = gameState.activeQuestion;
  const correctOpt = currentQ.correct_option ? currentQ.correct_option.toString().trim().toUpperCase() : '';

  // Cicla su tutte le risposte per registrare nel database
  for (const [teamId, resp] of Object.entries(gameState.responses)) {
    const selectedOpt = resp.option ? resp.option.toString().trim().toUpperCase() : '';
    const isCorrect = (selectedOpt === correctOpt);
    const pointsAwarded = isCorrect ? 1 : 0;
    
    await db.recordResponse(
      gameState.activeChallengeId,
      currentQ.id,
      parseInt(teamId),
      selectedOpt,
      isCorrect,
      pointsAwarded,
      resp.responseTimeMs || 0
    );
  }

  // Notifica la regia e il proiettore con i dati aggiornati dei punteggi (1 pt por cada resposta certa)
  const leaderboard = await db.getChallengeLeaderboard(gameState.activeChallengeId);
  const overall = await db.getOverallTournamentLeaderboard();
  
  io.emit('leaderboard_update', { challenge: leaderboard, overall });
}

// Costruisce la vista di stato per i client (nasconde la risposta corretta se in QUESTION_ACTIVE)
function buildPublicGameState() {
  let safeQuestion = null;
  if (gameState.activeQuestion) {
    safeQuestion = {
      id: gameState.activeQuestion.id,
      question_order: gameState.activeQuestion.question_order,
      category: gameState.activeQuestion.category,
      text: gameState.activeQuestion.text,
      option_a: gameState.activeQuestion.option_a,
      option_b: gameState.activeQuestion.option_b,
      option_c: gameState.activeQuestion.option_c,
      option_d: gameState.activeQuestion.option_d,
      points: gameState.activeQuestion.points,
      time_limit: gameState.activeQuestion.time_limit,
      // La risposta corretta viene inviata solo se lo stato non è QUESTION_ACTIVE o VOTING_CLOSED
      correct_option: (gameState.status === 'REVEAL_ANSWER' || gameState.status === 'ROUND_RESULTS') 
        ? gameState.activeQuestion.correct_option 
        : null
    };
  }

  // Dettaglio risposte squadre per la domanda corrente
  let teamOutcomes = [];
  if (gameState.status === 'REVEAL_ANSWER' || gameState.status === 'ROUND_RESULTS') {
    const correctOpt = gameState.activeQuestion ? gameState.activeQuestion.correct_option.toUpperCase() : '';
    teamOutcomes = Object.values(gameState.connectedTeams).map(team => {
      const resp = gameState.responses[team.id];
      const selected = resp ? resp.option.toUpperCase() : null;
      return {
        id: team.id,
        name: team.name,
        color: team.color,
        selectedOption: selected,
        isCorrect: selected === correctOpt
      };
    });
  }

  return {
    status: gameState.status,
    activeChallengeId: gameState.activeChallengeId,
    activeChallengeTitle: gameState.activeChallengeTitle,
    activeWeekName: gameState.activeWeekName,
    currentQuestionIndex: gameState.currentQuestionIndex,
    totalQuestions: gameState.questions.length,
    activeQuestion: safeQuestion,
    completedQuestionIds: gameState.completedQuestionIds || [],
    teamOutcomes: teamOutcomes,
    timerSeconds: gameState.timerSeconds,
    timerMax: gameState.timerMax,
    serverUrl: serverUrl,
    teamQrCodeUrl: teamQrCodeUrl,
    teamsCount: Object.keys(gameState.connectedTeams).length,
    votedCount: Object.keys(gameState.responses).length
  };
}

// Helper per aggiornare in tempo reale le domande della sfida attiva
async function refreshActiveChallengeQuestions(challengeId) {
  if (gameState.activeChallengeId == challengeId) {
    const questions = await db.getQuestionsForChallenge(challengeId);
    gameState.questions = questions;
    if (gameState.currentQuestionIndex >= questions.length) {
      gameState.currentQuestionIndex = Math.max(0, questions.length - 1);
    }
    if (questions.length > 0) {
      gameState.activeQuestion = questions[gameState.currentQuestionIndex];
    } else {
      gameState.activeQuestion = null;
    }
    io.emit('game_state_update', buildPublicGameState());
  }
}

// --- IMPORTAÇÃO DE TEXTO COLADO DIRECTAMENTE ---
const textParser = require('./textQuestionParser');

app.post('/api/admin/questions/import-text', async (req, res) => {
  const { challenge_id, raw_text } = req.body;
  try {
    const questions = textParser.parsePastedText(raw_text);
    if (questions.length === 0) {
      return res.status(400).json({ error: "Nenhuma pergunta válida encontrada no texto colado. Verifica o formato." });
    }

    const existing = await db.getQuestionsForChallenge(challenge_id);
    let order = existing.length + 1;

    for (let q of questions) {
      await db.saveQuestion({
        ...q,
        challenge_id,
        question_order: order++
      });
    }

    await refreshActiveChallengeQuestions(challenge_id);
    res.json({ success: true, count: questions.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao importar texto colado: " + err.message });
  }
});

// --- GERADOR AUTOMÁTICO DE PERGUNTAS POR DISCIPLINA & NÍVEL ---
const questionGenerator = require('./questionBankGenerator');

app.post('/api/admin/questions/auto-generate', async (req, res) => {
  const { challenge_id, subject, difficulty, count } = req.body;
  try {
    const numRequested = parseInt(count) || 5;
    const existing = await db.getQuestionsForChallenge(challenge_id);
    const usedTexts = await db.getAllUsedQuestionTexts();
    let order = existing.length + 1;

    const generated = questionGenerator.generateQuestions(subject, difficulty, numRequested, usedTexts);
    if (generated.length === 0) {
      return res.status(400).json({ error: "Nenhuma pergunta encontrada para esta disciplina/nível." });
    }

    for (let q of generated) {
      await db.saveQuestion({
        challenge_id,
        question_order: order++,
        category: subject,
        text: q.text,
        option_a: q.a,
        option_b: q.b,
        option_c: q.c,
        option_d: q.d,
        correct_option: q.correct,
        points: 1,
        time_limit: 15
      });
    }

    await refreshActiveChallengeQuestions(challenge_id);
    res.json({ success: true, count: generated.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar perguntas: " + err.message });
  }
});

// --- INTEGRAZIONE GOOGLE SHEETS ---
const googleSheets = require('./googleSheetsSync');

// Importazione domande direttamente da Link Google Sheets
app.post('/api/admin/sheets/import-url', async (req, res) => {
  const { challenge_id, sheet_url } = req.body;
  try {
    const questions = await googleSheets.fetchGoogleSheetsCSV(sheet_url);
    if (questions.length === 0) {
      return res.status(400).json({ error: "Nessuna domanda trovata nel foglio Google Sheets. Verifica che il foglio sia pubblicato sul Web o condiviso." });
    }

    let order = 1;
    for (let q of questions) {
      await db.saveQuestion({
        ...q,
        challenge_id,
        question_order: order++
      });
    }

    await refreshActiveChallengeQuestions(challenge_id);
    res.json({ success: true, count: questions.length });
  } catch (err) {
    res.status(500).json({ error: "Errore durante l'importazione da Google Sheets: " + err.message });
  }
});

// Esportazione Classifica Generale del Torneo in CSV per Google Sheets
app.get('/api/admin/sheets/export-csv', async (req, res) => {
  try {
    const overall = await db.getOverallTournamentLeaderboard();
    const csvContent = googleSheets.generateOverallCSV(overall);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=Olimpiadas_ESagrada_Classifica.csv');
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).send("Errore durante la generazione del CSV: " + err.message);
  }
});

// Sync Automatico via Webhook Google Apps Script
app.post('/api/admin/sheets/webhook-sync', async (req, res) => {
  const { webhook_url } = req.body;
  try {
    const overall = await db.getOverallTournamentLeaderboard();
    const teams = await db.getAllTeams();
    const payload = {
      event: 'TOURNAMENT_SYNC',
      timestamp: new Date().toISOString(),
      teamsCount: teams.length,
      leaderboard: overall
    };

    const result = await googleSheets.pushToGoogleSheetWebhook(webhook_url, payload);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Errore sync Google Sheets: " + err.message });
  }
});

// --- ROTTE API REST PER ADMIN & INFO ---

app.get('/api/info', (req, res) => {
  res.json({
    appName: "Olimpiadas ESagrada",
    serverUrl,
    localIp: localIpAddress,
    qrCode: teamQrCodeUrl
  });
});

app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    return res.json({ success: true, token: "admin-authenticated-token-esagrada" });
  }
  return res.status(401).json({ success: false, message: "PIN non corretto" });
});

// Ottieni settimane e sfide
app.get('/api/admin/weeks', async (req, res) => {
  try {
    const weeks = await db.getAllWeeksWithChallenges();
    res.json(weeks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nuova settimana / sessao
app.post('/api/admin/weeks', async (req, res) => {
  const { number, name } = req.body;
  try {
    const id = await db.createWeek(number, name);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar sessao
app.delete('/api/admin/weeks/:id', async (req, res) => {
  try {
    await db.deleteWeek(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset total dos pontos do torneio
app.post('/api/admin/scores/reset', async (req, res) => {
  try {
    await db.resetAllScores();
    io.emit('leaderboard_update', { challenge: [], overall: [] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Corrigir pontuação de uma equipa especificamente
app.post('/api/admin/scores/update', async (req, res) => {
  const { challenge_id, team_id, score } = req.body;
  try {
    await db.updateTeamScore(challenge_id, team_id, score);
    const leaderboard = await db.getChallengeLeaderboard(challenge_id);
    const overall = await db.getOverallTournamentLeaderboard();
    io.emit('leaderboard_update', { challenge: leaderboard, overall });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Exportar backup completo das sessoes em JSON
app.get('/api/admin/backup/export', async (req, res) => {
  try {
    await db.autoSaveBackupJSON();
    const weeks = await db.getAllWeeksWithChallenges();
    for (let w of weeks) {
      for (let c of w.challenges) {
        c.questions = await db.getQuestionsForChallenge(c.id);
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="esagrada_sessoes_backup.json"');
    res.send(JSON.stringify(weeks, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Importar/Restaurar backup completo de sessoes
app.post('/api/admin/backup/import', async (req, res) => {
  try {
    const backupData = req.body;
    if (!Array.isArray(backupData)) {
      return res.status(400).json({ success: false, message: 'Formato de backup inválido.' });
    }
    const fs = require('fs');
    const path = require('path');
    const dataDir = process.env.DATA_DIR || (fs.existsSync('/var/data') ? '/var/data' : path.join(__dirname, 'data'));
    const backupFilePath = path.join(dataDir, 'sessions_backup.json');
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');

    await db.autoRestoreBackupJSON();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nuova sfida
app.post('/api/admin/challenges', async (req, res) => {
  const { week_id, title } = req.body;
  try {
    const id = await db.createChallenge(week_id, title);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni domande di una sfida
app.get('/api/admin/challenges/:id/questions', async (req, res) => {
  try {
    const questions = await db.getQuestionsForChallenge(req.params.id);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salva/Aggiorna domanda
app.post('/api/admin/questions', async (req, res) => {
  try {
    const id = await db.saveQuestion(req.body);
    if (req.body.challenge_id) {
      await refreshActiveChallengeQuestions(req.body.challenge_id);
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina domanda
app.delete('/api/admin/questions/:id', async (req, res) => {
  try {
    await db.deleteQuestion(req.params.id);
    if (gameState.activeChallengeId) {
      await refreshActiveChallengeQuestions(gameState.activeChallengeId);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Riordina domande
app.post('/api/admin/questions/reorder', async (req, res) => {
  const { challenge_id, question_ids } = req.body;
  try {
    await db.reorderQuestions(challenge_id, question_ids);
    await refreshActiveChallengeQuestions(challenge_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Importazione batch domande (JSON)
app.post('/api/admin/questions/import', async (req, res) => {
  const { challenge_id, questions } = req.body;
  try {
    let order = 1;
    for (let q of questions) {
      await db.saveQuestion({
        ...q,
        challenge_id,
        question_order: order++
      });
    }
    res.json({ success: true, count: questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Classifiche
app.get('/api/leaderboard/overall', async (req, res) => {
  try {
    const leaderboard = await db.getOverallTournamentLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- WEBSOCKET EVENT HANDLERS ---

io.on('connection', (socket) => {
  // Invia immediatamente lo stato corrente al nuovo connesso
  socket.emit('game_state_update', buildPublicGameState());

  // Squadra si iscrive o si riconnette
  socket.on('team_join', async (teamData) => {
    try {
      const { name, color } = teamData;
      if (!name || !color) return;

      const team = await db.registerOrGetTeam(name, color);
      gameState.connectedTeams[socket.id] = team;
      socket.teamId = team.id;
      socket.teamName = team.name;

      socket.emit('team_joined', team);
      io.emit('teams_list_update', Object.values(gameState.connectedTeams));
      io.emit('game_state_update', buildPublicGameState());
      console.log(`Squadra connessa: ${team.name} (${team.color})`);
    } catch (err) {
      socket.emit('error_msg', 'Impossibile registrarsi: ' + err.message);
    }
  });

  // Ricezione voto dalla squadra
  socket.on('submit_vote', (voteData) => {
    if (gameState.status !== 'QUESTION_ACTIVE' && gameState.status !== 'VOTING_CLOSED') {
      return socket.emit('vote_rejected', 'Votazione non attiva.');
    }

    let team = gameState.connectedTeams[socket.id];

    // Fallback se il socket si è riconnesso da poco
    if (!team && voteData.teamId && voteData.teamName) {
      team = { id: voteData.teamId, name: voteData.teamName, color: voteData.color || '#3b82f6' };
      gameState.connectedTeams[socket.id] = team;
    }

    if (!team) {
      return socket.emit('vote_rejected', 'Registrati prima di votare.');
    }

    // Registra o sovrascrivi voto
    gameState.responses[team.id] = {
      option: voteData.option,
      responseTimeMs: (gameState.timerMax - gameState.timerSeconds) * 1000
    };

    socket.emit('vote_accepted', { option: voteData.option });
    io.emit('game_state_update', buildPublicGameState());
  });

  // --- CONTROLLI ADMIN VIA WEBSOCKET ---

  // Selezione della sfida da proiettare
  socket.on('admin_select_challenge', async ({ challengeId, pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    const questions = await db.getQuestionsForChallenge(challengeId);
    
    // Trova nome settimana e sfida
    const weeks = await db.getAllWeeksWithChallenges();
    let weekName = '';
    let challengeTitle = '';
    for (let w of weeks) {
      let found = w.challenges.find(c => c.id == challengeId);
      if (found) {
        weekName = w.name;
        challengeTitle = found.title;
        break;
      }
    }

    gameState.activeChallengeId = challengeId;
    gameState.activeChallengeTitle = challengeTitle;
    gameState.activeWeekName = weekName;
    gameState.questions = questions;
    gameState.currentQuestionIndex = 0;
    gameState.activeQuestion = questions[0];
    gameState.completedQuestionIds = [];
    gameState.status = 'LOBBY';
    gameState.responses = {};

    io.emit('game_state_update', buildPublicGameState());
    socket.emit('admin_success', 'Sfida caricata con successo!');
  });

  // Selezione diretta di una domanda cliccando sulla lista
  socket.on('admin_select_question_index', ({ index, pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    if (gameState.questions && index >= 0 && index < gameState.questions.length) {
      stopTimer();
      gameState.currentQuestionIndex = index;
      gameState.activeQuestion = gameState.questions[index];
      gameState.status = 'LOBBY';
      gameState.responses = {};

      io.emit('game_state_update', buildPublicGameState());
    }
  });

  // Avvio Domanda (Garante lanciare sempre la domanda selezionata)
  socket.on('admin_start_question', ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    if (!gameState.questions || gameState.questions.length === 0) {
      return socket.emit('admin_error', 'Nenhuma pergunta carregada neste desafio. Adiciona perguntas primeiro.');
    }

    if (!gameState.activeQuestion && gameState.questions.length > 0) {
      gameState.activeQuestion = gameState.questions[0];
      gameState.currentQuestionIndex = 0;
    }

    // Se a pergunta estava nos concluídos, limpa para permitir o arranque imediato
    if (gameState.activeQuestion && gameState.completedQuestionIds.includes(gameState.activeQuestion.id)) {
      gameState.completedQuestionIds = gameState.completedQuestionIds.filter(id => id !== gameState.activeQuestion.id);
    }

    gameState.status = 'QUESTION_ACTIVE';
    gameState.responses = {}; // Reset risposte del round

    const timeLimit = gameState.activeQuestion ? (gameState.activeQuestion.time_limit || 15) : 15;
    startQuestionTimer(timeLimit);

    io.emit('game_state_update', buildPublicGameState());
  });

  // Passa alla prossima domanda (salta domande già svolte)
  socket.on('admin_next_question', ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    let nextIndex = gameState.currentQuestionIndex + 1;
    while (nextIndex < gameState.questions.length && gameState.completedQuestionIds.includes(gameState.questions[nextIndex].id)) {
      nextIndex++;
    }

    if (nextIndex < gameState.questions.length) {
      stopTimer();
      gameState.currentQuestionIndex = nextIndex;
      gameState.activeQuestion = gameState.questions[nextIndex];
      gameState.status = 'LOBBY';
      gameState.responses = {};

      io.emit('game_state_update', buildPublicGameState());
    } else {
      socket.emit('admin_info', 'Chegaste ao fim das perguntas desta sessão!');
    }
  });

  // Domanda precedente
  socket.on('admin_prev_question', ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    if (gameState.currentQuestionIndex > 0) {
      stopTimer();
      gameState.currentQuestionIndex -= 1;
      gameState.activeQuestion = gameState.questions[gameState.currentQuestionIndex];
      gameState.status = 'LOBBY';
      gameState.responses = {};

      io.emit('game_state_update', buildPublicGameState());
    }
  });

  // Mostra Risultati Round / Classifica Sfida
  socket.on('admin_show_results', async ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    stopTimer();
    gameState.status = 'ROUND_RESULTS';
    const leaderboard = await db.getChallengeLeaderboard(gameState.activeChallengeId);
    const overall = await db.getOverallTournamentLeaderboard();

    io.emit('game_state_update', buildPublicGameState());
    io.emit('leaderboard_update', { challenge: leaderboard, overall });
  });

  // Mostra Classifica Generale del Torneo
  socket.on('admin_show_overall', async ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    stopTimer();
    gameState.status = 'TOURNAMENT_LEADERBOARD';
    const overall = await db.getOverallTournamentLeaderboard();

    io.emit('game_state_update', buildPublicGameState());
    io.emit('leaderboard_update', { overall });
  });

  // Torna alla Lobby con QR Code
  socket.on('admin_show_lobby', ({ pin }) => {
    if (pin !== ADMIN_PIN) return socket.emit('admin_error', 'PIN Errato');

    stopTimer();
    gameState.status = 'LOBBY';
    io.emit('game_state_update', buildPublicGameState());
  });

  // Disconnessione socket
  socket.on('disconnect', () => {
    delete gameState.connectedTeams[socket.id];
    io.emit('teams_list_update', Object.values(gameState.connectedTeams));
    io.emit('game_state_update', buildPublicGameState());
  });
});

// Avvio Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏆 OLIMPIADAS ESAGRADA - Quiz System Intranet Ready`);
  console.log(`🌐 Server Web: ${serverUrl}`);
  console.log(`📱 QR Code Squadre: ${serverUrl}/team.html`);
  console.log(`📺 Vista Proiettore: ${serverUrl}/projector.html`);
  console.log(`🔑 Regia Admin: ${serverUrl}/admin.html (PIN: ${ADMIN_PIN})`);
  console.log(`====================================================`);
});
