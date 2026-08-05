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
      points INTEGER DEFAULT 100,
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

  // Inserisce una sessão iniziale predefinita se il database è nuovo
  db.get('SELECT COUNT(*) as count FROM weeks', (err, row) => {
    if (!err && row.count === 0) {
      db.run('INSERT INTO weeks (number, name) VALUES (?, ?)', [1, 'Sessão 1']);
      db.run('INSERT INTO challenges (week_id, title) VALUES (?, ?)', [1, 'Desafio 1']);
      
      // Inserisce domande demonstrativas di prova
      const demoQuestions = [
        [1, 1, 'Geografia', 'Qual é a capital de Moçambique?', 'Beira', 'Maputo', 'Nampula', 'Pemba', 'B', 1, 15],
        [1, 2, 'História', 'Em que ano Moçambique proclamou a sua Independência?', '1964', '1975', '1992', '1980', 'B', 1, 15],
        [1, 3, 'Ciências', 'Qual é a fórmula química da água?', 'H2O', 'CO2', 'NaCl', 'O2', 'A', 1, 15]
      ];
      demoQuestions.forEach(q => {
        db.run('INSERT INTO questions (challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', q);
      });
      console.log('Dados iniciais de demonstração criados com sucesso.');
    }
  });
});

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
    return await dbQuery.run('DELETE FROM weeks WHERE id = ?', [weekId]);
  },

  async createChallenge(weekId, title) {
    const res = await dbQuery.run('INSERT INTO challenges (week_id, title) VALUES (?, ?)', [weekId, title]);
    return res.id;
  },

  // Domande
  async getQuestionsForChallenge(challengeId) {
    return await dbQuery.all('SELECT * FROM questions WHERE challenge_id = ? ORDER BY question_order ASC', [challengeId]);
  },

  async saveQuestion(questionData) {
    const { id, challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit } = questionData;
    if (id) {
      await dbQuery.run(`
        UPDATE questions 
        SET category = ?, text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, points = ?, time_limit = ?, question_order = ?
        WHERE id = ?
      `, [category, text, option_a, option_b, option_c, option_d, correct_option, points || 100, time_limit || 15, question_order, id]);
      return id;
    } else {
      const res = await dbQuery.run(`
        INSERT INTO questions 
        (challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [challenge_id, question_order, category || 'Generale', text, option_a, option_b, option_c, option_d, correct_option, points || 100, time_limit || 15]);
      return res.id;
    }
  },

  async deleteQuestion(id) {
    return await dbQuery.run('DELETE FROM questions WHERE id = ?', [id]);
  },

  async reorderQuestions(challengeId, questionIdsInOrder) {
    for (let index = 0; index < questionIdsInOrder.length; index++) {
      await dbQuery.run('UPDATE questions SET question_order = ? WHERE id = ? AND challenge_id = ?', [index + 1, questionIdsInOrder[index], challengeId]);
    }
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
  }
};
