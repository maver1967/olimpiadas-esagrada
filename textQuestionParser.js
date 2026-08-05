/**
 * Parser de texto inteligente para "Olimpiadas ESagrada".
 * Suporta formatações de IA (ChatGPT, Claude, Gemini, DeepSeek), incluindo:
 * - Negrito markdown: **1.** ou **Pergunta 1:**
 * - Opções: A), B), C), D) ou A., B., C., D.
 * - Respostas no final: "Resultado: 1-B, 2-B, 3-C, 4-A, 5-B" ou "Gabarito: 1.B, 2.B..."
 * - Respostas em linha: "Resposta: B" ou "Correcta: B"
 * - Tabelas CSV, Pipe (|), Tabuladores
 */

function parsePastedText(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  // Remove caracteres invisíveis e normaliza quebras de linha
  let cleaned = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. EXTRAIR GABARITO / RESULTADO FINAL SE EXISTIR NO FIM DO TEXTO
  // Exemplo: "Resultado: 1-B, 2-B, 3-C, 4-A, 5-B" ou "Gabarito: 1.B, 2.B, 3.C"
  const answerKeyMap = {};
  const answerKeyRegex = /(?:resultado|gabarito|respostas|soluções|gabarito final)\s*[:=\-]?\s*([\s\S]+)$/i;
  const matchKeyBlock = answerKeyRegex.exec(cleaned);

  if (matchKeyBlock) {
    const keyText = matchKeyBlock[1];
    // Procura padrões do tipo "1-B", "1:B", "1.B", "1) B", "1 - B"
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

  // TENTA FORMATO TABELA (CSV / PIPE / TAB) SE EXISTIREM VÍRGULAS OU BARRAS
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

  // TENTA FORMATO BLOCOS DE TEXTO (1. Pergunta / A) ... B) ... C) ... D) ... Resposta: B)
  let currentQ = null;
  let qCounter = 0;

  for (let line of lines) {
    // Ignora a linha do gabarito final para não ser confundida com texto
    if (/^(resultado|gabarito|respostas|soluções|gabarito final)\s*[:=\-]?/i.test(line)) {
      continue;
    }
    if (/^---/.test(line)) {
      continue;
    }

    const isNewQuestion = /^(pergunta\s*\d*|\d+[\.\)\-]|q\d+)/i.exec(line);
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
    } else if (isNewQuestion) {
      // Guarda a pergunta anterior se for válida
      if (currentQ && currentQ.text && currentQ.option_a) {
        if (!currentQ.correct_option && answerKeyMap[qCounter]) {
          currentQ.correct_option = answerKeyMap[qCounter];
        }
        questions.push(currentQ);
      }

      qCounter++;
      let cleanText = line.replace(/^(pergunta\s*\d*|\d+[\.\)\-]|q\d+)\s*[:\.\-]?\s*/i, '').trim();

      currentQ = {
        number: qCounter,
        category: 'Geografia & Conhecimentos',
        text: cleanText,
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: answerKeyMap[qCounter] || 'A',
        points: 1,
        time_limit: 15
      };
    } else if (currentQ && !currentQ.option_a && !line.toLowerCase().startsWith('ecco') && !line.toLowerCase().startsWith('aqui')) {
      // Se for uma continuação do texto da pergunta
      currentQ.text += ' ' + line.trim();
    }
  }

  // Adiciona a última pergunta do bloco
  if (currentQ && currentQ.text && currentQ.option_a) {
    if (!currentQ.correct_option && answerKeyMap[qCounter]) {
      currentQ.correct_option = answerKeyMap[qCounter];
    }
    questions.push(currentQ);
  }

  return questions;
}

module.exports = {
  parsePastedText
};
