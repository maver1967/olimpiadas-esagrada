/**
 * Parser de texto inteligente para "Olimpiadas ESagrada".
 * Suporta formatações de IA (ChatGPT, Claude, Gemini, DeepSeek) e colagem manual, incluindo:
 * - Opções horizontais numa só linha: "37 B. 3,7 C. 0,037 D. 0,37" ou "A. 37 B. 3,7 C. 0,037 D. 0,37"
 * - Respostas do tipo: "Certa D", "Certa: A", "Resposta: B", "Correcta: C", "Gabarito: D", "R: A"
 * - Perguntas sem numeração explícita
 * - Negrito markdown: **1.** ou **Pergunta 1:**
 * - Respostas no final: "Resultado: 1-B, 2-B, 3-C"
 * - Tabelas CSV, Pipe (|), Tabuladores
 */

function parsePastedText(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  // Remove caracteres invisíveis e normaliza quebras de linha
  let cleaned = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. EXTRAIR GABARITO / RESULTADO FINAL SE EXISTIR NO FIM DO TEXTO
  const answerKeyMap = {};
  const answerKeyRegex = /(?:resultado|gabarito|respostas|soluções|gabarito final)\s*[:=\-]?\s*([\s\S]+)$/i;
  const matchKeyBlock = answerKeyRegex.exec(cleaned);

  if (matchKeyBlock) {
    const keyText = matchKeyBlock[1];
    const pairRegex = /(\d+)\s*[\:\.\)\-]?\s*([a-dA-D])/g;
    let matchPair;
    while ((matchPair = pairRegex.exec(keyText)) !== null) {
      const qNum = parseInt(matchPair[1]);
      const qAns = matchPair[2].toUpperCase();
      answerKeyMap[qNum] = qAns;
    }
  }

  // Limpa marcações markdown bold/italic (ex: **1.** -> 1.)
  let lines = cleaned
    .split('\n')
    .map(l => l.replace(/\*\*/g, '').replace(/__/g, '').trim())
    .filter(l => l.length > 0);

  const questions = [];

  // 2. TENTA FORMATO TABELA (CSV / PIPE / TAB)
  let isTableFormat = false;
  for (let line of lines) {
    if (line.toLowerCase().startsWith('categoria,pergunta') || line.toLowerCase().startsWith('categoria|pergunta')) {
      continue;
    }

    let parts = [];
    if (line.includes('|')) {
      parts = line.split('|').map(p => p.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    } else if (line.includes(',') && !line.match(/^(pergunta|\d+[\.\)\-])/i)) {
      parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',').map(p => p.trim());
      parts = parts.map(p => p.replace(/^"|"$/g, '').trim());
    }

    if (parts.length >= 6) {
      isTableFormat = true;
      let category = parts.length >= 7 ? parts[0] : 'Geral';
      let text = parts.length >= 7 ? parts[1] : parts[0];
      let a = parts.length >= 7 ? parts[2] : parts[1];
      let b = parts.length >= 7 ? parts[3] : parts[2];
      let c = parts.length >= 7 ? parts[4] : parts[3];
      let d = parts.length >= 7 ? parts[5] : parts[4];
      let correct = parts.length >= 7 ? parts[6] : parts[5];

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

  // 3. HELPER PARA EXTRAIR OPÇÕES HORIZONTAIS NUMA ÚNICA LINHA
  function extractHorizontalOptions(line) {
    const matchB = /\b[bB][\.\)\:\-]\s*/.exec(line);
    const matchC = /\b[cC][\.\)\:\-]\s*/.exec(line);
    const matchD = /\b[dD][\.\)\:\-]\s*/.exec(line);

    if (matchB && matchC) {
      let optA = line.substring(0, matchB.index).replace(/^[aA][\.\)\:\-]\s*/, '').trim();
      let optB = '', optC = '', optD = '';
      if (matchD) {
        optB = line.substring(matchB.index + matchB[0].length, matchC.index).trim();
        optC = line.substring(matchC.index + matchC[0].length, matchD.index).trim();
        optD = line.substring(matchD.index + matchD[0].length).trim();
      } else {
        optB = line.substring(matchB.index + matchB[0].length, matchC.index).trim();
        optC = line.substring(matchC.index + matchC[0].length).trim();
      }
      return { a: optA, b: optB, c: optC, d: optD };
    }
    return null;
  }

  // 4. PARSER DE BLOCOS DE TEXTO FLEXÍVEL
  let currentQ = null;
  let qCounter = 0;

  function finalizeCurrentQ() {
    if (currentQ && currentQ.text) {
      if (!currentQ.option_a && !currentQ.option_b) {
        currentQ.option_a = 'Verdadeiro';
        currentQ.option_b = 'Falso';
        currentQ.option_c = 'N/A';
        currentQ.option_d = 'N/A';
      }
      if (!currentQ.correct_option && answerKeyMap[currentQ.number]) {
        currentQ.correct_option = answerKeyMap[currentQ.number];
      }
      questions.push(currentQ);
      currentQ = null;
    }
  }

  for (let line of lines) {
    if (/^(resultado|gabarito|respostas|soluções|gabarito final)\s*[:=\-]?/i.test(line)) {
      continue;
    }
    if (/^---/.test(line)) {
      continue;
    }

    const isAnswerLine = /^(resposta|correcta|correta|certa|gabarito|esatta|resp|r)\s*[:=\-]?\s*([a-dA-D])/i.exec(line);
    const isNewQuestionNumber = /^(pergunta\s*\d*|\d+[\.\)\-]|q\d+)/i.exec(line);
    const horizOpts = extractHorizontalOptions(line);

    const isOptionA = /^(a[\)\.\:\-]|a\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionB = /^(b[\)\.\:\-]|b\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionC = /^(c[\)\.\:\-]|c\s*[\)\.\:\-])\s*(.*)/i.exec(line);
    const isOptionD = /^(d[\)\.\:\-]|d\s*[\)\.\:\-])\s*(.*)/i.exec(line);

    if (isAnswerLine && currentQ) {
      currentQ.correct_option = isAnswerLine[2].toUpperCase();
      finalizeCurrentQ();
    } else if (horizOpts && currentQ) {
      currentQ.option_a = horizOpts.a;
      currentQ.option_b = horizOpts.b;
      currentQ.option_c = horizOpts.c || 'N/A';
      currentQ.option_d = horizOpts.d || 'N/A';
    } else if (isOptionA && currentQ) {
      currentQ.option_a = isOptionA[2].trim();
    } else if (isOptionB && currentQ) {
      currentQ.option_b = isOptionB[2].trim();
    } else if (isOptionC && currentQ) {
      currentQ.option_c = isOptionC[2].trim();
    } else if (isOptionD && currentQ) {
      currentQ.option_d = isOptionD[2].trim();
    } else if (isNewQuestionNumber || !currentQ) {
      qCounter++;
      let cleanText = line.replace(/^(pergunta\s*\d*|\d+[\.\)\-]|q\d+)\s*[:\.\-]?\s*/i, '').trim();

      currentQ = {
        number: qCounter,
        category: 'Matemática & Conhecimentos',
        text: cleanText,
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: answerKeyMap[qCounter] || 'A',
        points: 1,
        time_limit: 15
      };
    } else if (currentQ && !currentQ.option_a) {
      currentQ.text += ' ' + line.trim();
    }
  }

  finalizeCurrentQ();
  return questions;
}

module.exports = {
  parsePastedText
};
