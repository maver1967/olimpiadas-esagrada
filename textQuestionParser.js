/**
 * Parser de texto livre para importar perguntas coladas directamente no painel Admin.
 * Suporta formatos CSV, Pipe (|), Tabuladores, e blocos de texto (Pergunta / A, B, C, D / Resposta).
 */

function parsePastedText(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questions = [];

  // TENTA FORMATO 1: Linhas separadas por Pipe (|), Tab (\t) ou Vírgula (CSV)
  let isTableFormat = false;

  for (let line of lines) {
    if (line.toLowerCase().startsWith('categoria,pergunta') || line.toLowerCase().startsWith('categoria|pergunta')) {
      continue; // Ignora cabeçalhos
    }

    let parts = [];
    if (line.includes('|')) {
      parts = line.split('|').map(p => p.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    } else if (line.includes(',')) {
      // Divide por vírgula respeitando aspas
      parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',').map(p => p.trim());
      parts = parts.map(p => p.replace(/^"|"$/g, '').trim());
    }

    if (parts.length >= 6) {
      isTableFormat = true;
      let category = 'Geral';
      let text = '';
      let a = '', b = '', c = '', d = '';
      let correct = 'A';

      if (parts.length >= 7) {
        category = parts[0];
        text = parts[1];
        a = parts[2];
        b = parts[3];
        c = parts[4];
        d = parts[5];
        correct = parts[6];
      } else {
        text = parts[0];
        a = parts[1];
        b = parts[2];
        c = parts[3];
        d = parts[4];
        correct = parts[5];
      }

      correct = correct.replace(/[^abcdABCD]/g, '').toUpperCase().charAt(0) || 'A';

      if (text && a && b) {
        questions.push({
          category,
          text,
          option_a: a,
          option_b: b,
          option_c: c || 'N/A',
          option_d: d || 'N/A',
          correct_option: correct,
          points: 1,
          time_limit: 15
        });
      }
    }
  }

  if (isTableFormat && questions.length > 0) {
    return questions;
  }

  // TENTA FORMATO 2: Bloco de Texto corrido (1. Pergunta / A) ... / B) ... / C) ... / D) ... / Resposta: B)
  let currentQ = null;

  for (let line of lines) {
    // Detecta nova pergunta (começa com número ou 'Pergunta:')
    const isNewQuestion = /^(pergunta|\d+[\.\)\-]|q\d+)/i.test(line);
    const isAnswerLine = /^(resposta|correcta|correta|gabarito|esatta)\s*[:=\-]?\s*([a-dA-D])/i.exec(line);
    const isOptionA = /^(a[\)\.\:\-]|a\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionB = /^(b[\)\.\:\-]|b\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionC = /^(c[\)\.\:\-]|c\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionD = /^(d[\)\.\:\-]|d\s*[\)\.\:\-])\s*(.*)/i.exec(line);

    if (isOptionA && currentQ) {
      currentQ.option_a = isOptionA[2].trim();
    } else if (isOptionB && currentQ) {
      currentQ.option_b = isOptionB[2].trim();
    } else if (isOptionC && currentQ) {
      currentQ.option_c = isOptionC[2].trim();
    } else if (isOptionD && currentQ) {
      currentQ.option_d = isOptionD[2].trim();
    } else if (isAnswerLine && currentQ) {
      currentQ.correct_option = isAnswerLine[2].toUpperCase();
    } else if (isNewQuestion || !currentQ) {
      if (currentQ && currentQ.text && currentQ.option_a) {
        questions.push(currentQ);
      }
      let cleanText = line.replace(/^(pergunta|\d+[\.\)\-]|q\d+)\s*[:\.\-]?\s*/i, '').trim();
      currentQ = {
        category: 'Geral',
        text: cleanText,
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        points: 1,
        time_limit: 15
      };
    }
  }

  if (currentQ && currentQ.text && currentQ.option_a) {
    questions.push(currentQ);
  }

  return questions;
}

module.exports = {
  parsePastedText
};
