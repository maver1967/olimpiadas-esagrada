const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Assicura l'esistenza della cartella ./data per il database portabile
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'olimpiadas.db');
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

  // Inserisce una settimana iniziale predefinita se il database è nuovo
  db.get('SELECT COUNT(*) as count FROM weeks', (err, row) => {
    if (!err && row.count === 0) {
      db.run('INSERT INTO weeks (number, name) VALUES (?, ?)', [1, 'Settimana 1']);
      db.run('INSERT INTO challenges (week_id, title) VALUES (?, ?)', [1, 'Sfida 1']);
      
      // Inseriamo alcune domande dimostrative per test immediato
      const demoQuestions = [
        [1, 1, 'Geografia', 'Qual è la capitale del Mozambico?', 'Beira', 'Maputo', 'Nampula', 'Pemba', 'B', 100, 15],
        [1, 2, 'Scienza', 'Qual è la formula chimica dell\'acqua?', 'H2O', 'CO2', 'NaCl', 'O2', 'A', 100, 15],
        [1, 3, 'Storia & Cultura', 'Quanti colori ha la bandiera del Mozambico?', '3', '4', '5', '6', 'C', 100, 15]
      ];
      const stmt = db.prepare(`
        INSERT INTO questions 
        (challenge_id, question_order, category, text, option_a, option_b, option_c, option_d, correct_option, points, time_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      demoQuestions.forEach(q => stmt.run(q));
      stmt.finalize();
      console.log('Dati iniziali dimostrativi creati con successo.');
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

  // Risposte e Punteggi
  async recordResponse(challengeId, questionId, teamId, selectedOption, isCorrect, pointsAwarded, responseTimeMs) {
    await dbQuery.run(`
      INSERT INTO responses (challenge_id, question_id, team_id, selected_option, is_correct, points_awarded, response_time_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [challengeId, questionId, teamId, selectedOption, isCorrect ? 1 : 0, pointsAwarded, responseTimeMs]);

    if (pointsAwarded > 0) {
      await dbQuery.run(`
        INSERT INTO match_scores (challenge_id, team_id, score)
        VALUES (?, ?, ?)
        ON CONFLICT(challenge_id, team_id) DO UPDATE SET
        score = score + excluded.score,
        updated_at = CURRENT_TIMESTAMP
      `, [challengeId, teamId, pointsAwarded]);
    }
  },

  // Classifica Sfida Singola
  async getChallengeLeaderboard(challengeId) {
    return await dbQuery.all(`
      SELECT t.id, t.name, t.color, COALESCE(ms.score, 0) as score
      FROM teams t
      LEFT JOIN match_scores ms ON ms.team_id = t.id AND ms.challenge_id = ?
      ORDER BY score DESC, t.name ASC
    `, [challengeId]);
  },

  // Classifica Generale del Torneo (Tutte le settimane)
  async getOverallTournamentLeaderboard() {
    return await dbQuery.all(`
      SELECT t.id, t.name, t.color, COALESCE(SUM(ms.score), 0) as total_score
      FROM teams t
      LEFT JOIN match_scores ms ON ms.team_id = t.id
      GROUP BY t.id, t.name, t.color
      ORDER BY total_score DESC, t.name ASC
    `);
  },

  // Reset Torneo / Dati
  async resetAllScores() {
    await dbQuery.run('DELETE FROM responses');
    await dbQuery.run('DELETE FROM match_scores');
  }
};
