const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Suporte para disco persistente no Render (/var/data) ou directoria de dados local
const dataDir = process.env.DATA_DIR || (fs.existsSync('/var/data') ? '/var/data' : path.join(__dirname, 'data'));
if (!fs.existsSync(dataDir)) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch(e) {}
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'olimpiadas.db');
console.log('📍 Ficheiro da Base de Dados SQLite localizado em:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore durante l\'apertura del database SQLite:', err.message);
  } else {
    console.log('Connessione al database SQLite "olimpiadas.db" stabilita con successo.');
  }
});

// Inizializzazione Tabelle
db.serialize(() => {
  // Tabella Settimane del Torneo
  db.run(`
    CREATE TABLE IF NOT EXISTS weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella Sfide / Match per ciascuna settimana
  db.run(`
    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (week_id) REFERENCES weeks (id) ON DELETE CASCADE
    )
  `);

  // Tabella Domande per sfida
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      question_order INTEGER NOT NULL,
      category TEXT DEFAULT 'Generale',
      text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
      points INTEGER DEFAULT 1,
      time_limit INTEGER DEFAULT 15,
      FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
    )
  `);

  // Tabella Squadre iscritte
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella Risposte inviate nelle varie sfide
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      selected_option TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      points_awarded INTEGER NOT NULL,
      response_time_ms INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (challenge_id) REFERENCES challenges (id),
      FOREIGN KEY (question_id) REFERENCES questions (id),
      FOREIGN KEY (team_id) REFERENCES teams (id)
    )
  `);

  // Tabella Punteggi della singola sfida
  db.run(`
    CREATE TABLE IF NOT EXISTS match_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(challenge_id, team_id),
      FOREIGN KEY (challenge_id) REFERENCES challenges (id),
      FOREIGN KEY (team_id) REFERENCES teams (id)
    )
  `);

  // Carrega sempre o repositório mestre no arranque do banco de dados
  db.get('SELECT COUNT(*) as count FROM weeks', async (err, row) => {
    await autoRestoreBackupJSON();
  });
});

const repositoryFilePath = path.join(__dirname, 'data', 'sessions_repository.json');
const backupFilePath = path.join(dataDir, 'sessions_backup.json');
const CLOUD_STORAGE_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0a44f97d40d13';

async function autoSaveBackupJSON() {
  try {
    const weeks = await dbQuery.all('SELECT * FROM weeks ORDER BY number ASC');
    for (let w of weeks) {
      w.challenges = await dbQuery.all('SELECT * FROM challenges WHERE week_id = ? ORDER BY id ASC', [w.id]);
      for (let c of w.challenges) {
        c.questions = await dbQuery.all('SELECT * FROM questions WHERE challenge_id = ? ORDER BY question_order ASC', [c.id]);
      }
    }
    const jsonStr = JSON.stringify(weeks, null, 2);
    fs.writeFileSync(repositoryFilePath, jsonStr, 'utf8');
    try { fs.writeFileSync(backupFilePath, jsonStr, 'utf8'); } catch(e) {}
    console.log('💾 Repositório local "sessions_repository.json" guardado com sucesso.');

    // Sincronização em tempo real com a Nuvem Global (Visível em todos os computadores da Internet)
    try {
      const response = await fetch(CLOUD_STORAGE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'esagrada_sessions', data: weeks })
      });
      if (response.ok) {
        console.log('🌐 Sincronizado instantaneamente com a Nuvem Global! (Visível em todos os dispositivos)');
      }
    } catch(cloudErr) {
      console.error('Aviso: Falha temporária ao sincronizar com a Nuvem Global:', cloudErr.message);
    }

  } catch (err) {
    console.error('Erro ao auto-guardar repositório JSON:', err.message);
  }
}

async function autoRestoreBackupJSON() {
  let weeks = null;

  // 1. Tenta descarregar primeiro da Nuvem Global (para obter o trabalho feito de qualquer computador)
  try {
    const cloudRes = await fetch(CLOUD_STORAGE_URL);
    if (cloudRes.ok) {
      const cloudObj = await cloudRes.json();
      if (cloudObj && cloudObj.data && Array.isArray(cloudObj.data) && cloudObj.data.length > 0) {
        weeks = cloudObj.data;
        console.log('🌐 Sessões restauradas com sucesso a partir da NUVEM GLOBAL! (Visíveis em todos os computadores)');
      }
    }
  } catch(e) {
    console.log('Aviso: Não foi possível ler da nuvem global, a usar cópia local...');
  }

  // 2. Fallback para ficheiro local se a nuvem não tiver dados
  if (!weeks) {
    const targetFile = fs.existsSync(repositoryFilePath) ? repositoryFilePath : (fs.existsSync(backupFilePath) ? backupFilePath : null);
    if (!targetFile) return false;
    try {
      const raw = fs.readFileSync(targetFile, 'utf8');
      weeks = JSON.parse(raw);
    } catch(e) {
      return false;
    }
  }

  if (!Array.isArray(weeks) || weeks.length === 0) return false;

  try {
    console.log('🔄 A restaurar estrutura de sessões na base de dados...');
    await dbQuery.run('DELETE FROM questions');
    await dbQuery.run('DELETE FROM challenges');
    await dbQuery.run('DELETE FROM weeks');

    for (let w of weeks) {
      const resW = await dbQuery.run('INSERT INTO weeks (number, name) VALUES (?, ?)', [w.number, w.name]);
      const weekId = resW.id;

      if (Array.isArray(w.challenges)) {
        for (let c of w.challenges) {
          const resC = await dbQuery.run('INSERT INTO challenges (week_id, title, status) VALUES (?, ?, ?)', [weekId, c.title, c.status || 'draft']);
          const challengeId = resC.id;

          if (Array.isArray(c.questions)) {
            for (let q of c.questions) {
              await dbQuery.run(`
                INSERT INTO questions 
                (challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [challengeId, q.question_order, q.category, q.text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.points || 1, q.time_limit || 15]);
            }
          }
        }
      }
    }
    console.log('✅ Sessões carregadas com 100% de sucesso!');
    return true;
  } catch (err) {
    console.error('Erro ao restaurar repositório JSON:', err.message);
    return false;
  }
}

// Helper con Promise per query pulite
const dbQuery = {
  all: (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  }),
  get: (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  }),
  run: (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
    });
  })
};

// Funzioni API Database
module.exports = {
  db,
  dbQuery,

  // Squadre
  async registerOrGetTeam(name, color) {
    const existing = await dbQuery.get('SELECT * FROM teams WHERE LOWER(name) = LOWER(?)', [name]);
    if (existing) {
      // Aggiorna colore se cambiato
      await dbQuery.run('UPDATE teams SET color = ? WHERE id = ?', [color, existing.id]);
      return { ...existing, color };
    }
    const res = await dbQuery.run('INSERT INTO teams (name, color) VALUES (?, ?)', [name, color]);
    return { id: res.id, name, color };
  },

  async getAllTeams() {
    return await dbQuery.all('SELECT * FROM teams ORDER BY name ASC');
  },

  // Settimane e Sfide
  async getAllWeeksWithChallenges() {
    const weeks = await dbQuery.all('SELECT * FROM weeks ORDER BY number ASC');
    for (let w of weeks) {
      w.challenges = await dbQuery.all('SELECT * FROM challenges WHERE week_id = ? ORDER BY id ASC', [w.id]);
    }
    return weeks;
  },

  async createWeek(number, name) {
    const res = await dbQuery.run('INSERT INTO weeks (number, name) VALUES (?, ?)', [number, name]);
    autoSaveBackupJSON();
    return res.id;
  },

  async deleteWeek(weekId) {
    const challenges = await dbQuery.all('SELECT id FROM challenges WHERE week_id = ?', [weekId]);
    for (let c of challenges) {
      await dbQuery.run('DELETE FROM questions WHERE challenge_id = ?', [c.id]);
      await dbQuery.run('DELETE FROM responses WHERE challenge_id = ?', [c.id]);
      await dbQuery.run('DELETE FROM match_scores WHERE challenge_id = ?', [c.id]);
    }
    await dbQuery.run('DELETE FROM challenges WHERE week_id = ?', [weekId]);
    const res = await dbQuery.run('DELETE FROM weeks WHERE id = ?', [weekId]);
    autoSaveBackupJSON();
    return res;
  },

  async createChallenge(weekId, title) {
    const res = await dbQuery.run('INSERT INTO challenges (week_id, title) VALUES (?, ?)', [weekId, title]);
    autoSaveBackupJSON();
    return res.id;
  },

  // Domande
  async getQuestionsForChallenge(challengeId) {
    return await dbQuery.all('SELECT * FROM questions WHERE challenge_id = ? ORDER BY question_order ASC', [challengeId]);
  },

  async saveQuestion(questionData) {
    const { id, challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit } = questionData;
    let resultId = id;
    if (id) {
      await dbQuery.run(`
        UPDATE questions 
        SET category = ?, text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, points = ?, time_limit = ?, question_order = ?
        WHERE id = ?
      `, [category, text, option_a, option_b, option_c, option_d, correct_option, points || 1, time_limit || 15, question_order, id]);
    } else {
      const res = await dbQuery.run(`
        INSERT INTO questions 
        (challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [challenge_id, question_order, category || 'Geral', text, option_a, option_b, option_c, option_d, correct_option, points || 1, time_limit || 15]);
      resultId = res.id;
    }
    autoSaveBackupJSON();
    return resultId;
  },

  async deleteQuestion(id) {
    const res = await dbQuery.run('DELETE FROM questions WHERE id = ?', [id]);
    autoSaveBackupJSON();
    return res;
  },

  async reorderQuestions(challengeId, questionIdsInOrder) {
    for (let index = 0; index < questionIdsInOrder.length; index++) {
      await dbQuery.run('UPDATE questions SET question_order = ? WHERE id = ? AND challenge_id = ?', [index + 1, questionIdsInOrder[index], challengeId]);
    }
    autoSaveBackupJSON();
  },

  // Risposte e Punteggi (1 punto per ciascuna risposta corretta, 0 per errata)
  async recordResponse(challengeId, questionId, teamId, selectedOption, isCorrect, pointsAwarded, responseTimeMs) {
    // Evita duplicati per la stessa domanda e squadra
    await dbQuery.run(`
      DELETE FROM responses WHERE challenge_id = ? AND question_id = ? AND team_id = ?
    `, [challengeId, questionId, teamId]);

    const pts = isCorrect ? 1 : 0;

    await dbQuery.run(`
      INSERT INTO responses (challenge_id, question_id, team_id, selected_option, is_correct, points_awarded, response_time_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [challengeId, questionId, teamId, selectedOption, isCorrect ? 1 : 0, pts, responseTimeMs]);

    // Aggiorna match_scores
    await dbQuery.run(`
      INSERT INTO match_scores (challenge_id, team_id, score)
      VALUES (?, ?, ?)
      ON CONFLICT(challenge_id, team_id) DO UPDATE SET
      score = (SELECT COUNT(*) FROM responses WHERE challenge_id = ? AND team_id = ? AND is_correct = 1),
      updated_at = CURRENT_TIMESTAMP
    `, [challengeId, teamId, pts, challengeId, teamId]);
  },

  // Classifica Sfida Singola (Calcolo esatto 1 pt per risposta corretta)
  async getChallengeLeaderboard(challengeId) {
    return await dbQuery.all(`
      SELECT t.id, t.name, t.color, 
             COALESCE(SUM(CASE WHEN r.is_correct = 1 THEN 1 ELSE 0 END), 0) as score
      FROM teams t
      LEFT JOIN responses r ON r.team_id = t.id AND r.challenge_id = ?
      GROUP BY t.id, t.name, t.color
      ORDER BY score DESC, t.name ASC
    `, [challengeId]);
  },

  // Classifica Generale del Torneo (Somma 1 pt per ciascuna risposta corretta di todas as semanas)
  async getOverallTournamentLeaderboard() {
    return await dbQuery.all(`
      SELECT t.id, t.name, t.color, 
             COALESCE(SUM(CASE WHEN r.is_correct = 1 THEN 1 ELSE 0 END), 0) as total_score
      FROM teams t
      LEFT JOIN responses r ON r.team_id = t.id
      GROUP BY t.id, t.name, t.color
      ORDER BY total_score DESC, t.name ASC
    `);
  },

  // Recupera tutti i testi delle domande già usate nel torneo (per evitare ripetizioni nelle settimane successive)
  async getAllUsedQuestionTexts() {
    const rows = await dbQuery.all('SELECT DISTINCT LOWER(text) as text FROM questions');
    return rows.map(r => r.text.trim());
  },

  // Reset Torneo / Dati
  async resetAllScores() {
    await dbQuery.run('DELETE FROM responses');
    await dbQuery.run('DELETE FROM match_scores');
  },

  async updateTeamScore(challengeId, teamId, score) {
    await dbQuery.run(`
      INSERT INTO match_scores (challenge_id, team_id, score)
      VALUES (?, ?, ?)
      ON CONFLICT(challenge_id, team_id) DO UPDATE SET
      score = ?,
      updated_at = CURRENT_TIMESTAMP
    `, [challengeId, teamId, score, score]);
  },

  autoSaveBackupJSON,
  autoRestoreBackupJSON
};
