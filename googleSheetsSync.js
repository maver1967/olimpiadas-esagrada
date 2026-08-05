const http = require('http');
const https = require('https');
const { URL } = require('url');

/**
 * Modulo per l'integrazione con Google Sheets
 * 1. Importazione Domande da Google Sheets (URL CSV / Pubblicato sul Web)
 * 2. Esportazione Dati e Punteggi in formato CSV compatibile con Google Sheets
 * 3. Sync automatico via Webhook (Google Apps Script)
 */

// Scomposizione CSV semplice
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1').toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex per gestire i campi racchiusi tra virgolette o separati da virgole
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const values = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1];
      if (val === undefined) continue;
      val = val.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
      values.push(val);
    }

    if (values.length >= 7) {
      rows.push({
        category: values[0] || 'Generale',
        text: values[1] || '',
        option_a: values[2] || '',
        option_b: values[3] || '',
        option_c: values[4] || '',
        option_d: values[5] || '',
        correct_option: (values[6] || 'A').toUpperCase(),
        points: parseInt(values[7]) || 100,
        time_limit: parseInt(values[8]) || 15
      });
    }
  }
  return rows;
}

// Fetch di un file CSV da URL Google Sheets
function fetchGoogleSheetsCSV(sheetUrl) {
  return new Promise((resolve, reject) => {
    // Trasforma l'URL standard di Google Sheets in URL CSV se necessario
    let csvUrl = sheetUrl;
    if (sheetUrl.includes('docs.google.com/spreadsheets')) {
      if (!sheetUrl.includes('output=csv') && !sheetUrl.includes('/export?format=csv')) {
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
        }
      }
    }

    const client = csvUrl.startsWith('https') ? https : http;
    client.get(csvUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Segue l'eventuale redirect di Google
        return fetchGoogleSheetsCSV(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const questions = parseCSV(data);
          resolve(questions);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Invia dati al Webhook Google Apps Script dell'utente
function pushToGoogleSheetWebhook(webhookUrl, dataPayload) {
  return new Promise((resolve, reject) => {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      return reject(new Error("URL Webhook Google Sheets non valido"));
    }

    const urlObj = new URL(webhookUrl);
    const postData = JSON.stringify(dataPayload);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const client = webhookUrl.startsWith('https') ? https : http;
    const req = client.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody }));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Genera CSV per esportare i punteggi generali del torneo
function generateOverallCSV(leaderboardData) {
  let csv = "Posicao,Equipa,Cor,Pontos Totais\n";
  leaderboardData.forEach((row, index) => {
    csv += `"${index + 1}","${row.name.replace(/"/g, '""')}","${row.color}",${row.total_score}\n`;
  });
  return csv;
}

module.exports = {
  fetchGoogleSheetsCSV,
  pushToGoogleSheetWebhook,
  generateOverallCSV
};
