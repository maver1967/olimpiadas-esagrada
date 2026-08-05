/**
 * Gerador de Perguntas de Quiz para Olimpiadas ESagrada
 * Disciplinas: Filosofia, Geografia de Moçambique, História, Biologia, Língua Portuguesa, Ética, Conhecimentos Gerais, Economia
 * Níveis: Fácil (10ª Classe), Médio (11ª Classe), Difícil (12ª Classe / Pré-Universitária)
 */

const questionsCatalog = {
  "Filosofia": {
    "Fácil": [
      { text: "Quem é considerado o pai da Filosofia ocidental?", a: "Aristóteles", b: "Tales de Mileto", c: "Platão", d: "Sócrates", correct: "B" },
      { text: "Qual é o significado etimológico da palavra 'Filosofia'?", a: "Amor à sabedoria", b: "Ciência dos deuses", c: "Estudo da natureza", d: "Arte de falar", correct: "A" },
      { text: "Qual filósofo disse a famosa frase 'Só sei que nada sei'?", a: "Platão", b: "Sócrates", c: "Descartes", d: "Kant", correct: "B" }
    ],
    "Médio": [
      { text: "O que caracteriza o mito da caverna de Platão?", a: "A passagem da ilusão das sombras para a luz da verdade", b: "A origem dos deuses do Olimpo", c: "A teoria do contrato social", d: "A negação da existência da alma", correct: "A" },
      { text: "Na lógica aristotélica, o que é um silogismo?", a: "Um poema filosófico", b: "Um raciocínio dedutivo formado por duas premissas e uma conclusão", c: "Uma dúvida metódica", d: "Um diálogo entre mestre e aluno", correct: "B" },
      { text: "O que defende o Empirismo na teoria do conhecimento?", a: "Que todo o conhecimento deriva da experiência sensorial", b: "Que nascemos com ideias inatas", c: "Que a razão pura é a única fonte da verdade", d: "Que a verdade é impossível de alcançar", correct: "A" }
    ],
    "Difícil": [
      { text: "Segundo Immanuel Kant, o que é o 'Imperativo Categórico'?", a: "Uma regra baseada na busca pelo prazer individual", b: "Um princípio moral incondicional que deve valer como lei universal", c: "Uma ordem ditada pelo Estado para manter a ordem pública", d: "Uma hipótese científica sobre a ética", correct: "B" },
      { text: "Qual é o tema central da obra 'O Existencialismo é um Humanismo' de Jean-Paul Sartre?", a: "A existência precede a essência", b: "Deus determina o destino humano", c: "A matéria é mais importante que o espírito", d: "O conhecimento é ilusório", correct: "A" },
      { text: "Na filosofia africana, qual é o conceito ético expresso pela palavra 'Ubuntu'?", a: "Busca do poder político", b: "Eu sou porque nós somos (humanidade compartilhada)", c: "Racionalismo estrito", d: "Acumulação de riqueza material", correct: "B" }
    ]
  },
  "Geografia de Moçambique": {
    "Fácil": [
      { text: "Qual é o rio mais extenso de Moçambique?", a: "Rio Limpopo", b: "Rio Zambeze", c: "Rio Rovuma", d: "Rio Save", correct: "B" },
      { text: "Qual é o ponto mais alto de Moçambique?", a: "Monte Binga", b: "Monte Namuli", c: "Monte Gorongosa", d: "Monte Mabu", correct: "A" },
      { text: "Em qual província se localiza a cidade da Maxixe?", a: "Gaza", b: "Inhambane", c: "Sofala", d: "Maputo Província", correct: "B" }
    ],
    "Médio": [
      { text: "O Parque Nacional da Gorongosa localiza-se em qual província?", a: "Inhambane", b: "Manica", c: "Sofala", d: "Tete", correct: "C" },
      { text: "Qual é o clima predominante na maior parte do território moçambicano?", a: "Tropical húmido e seco", b: "Equatorial", c: "Desértico", d: "Mediterrânico", correct: "A" },
      { text: "Qual é o rio que serve de fronteira natural entre Moçambique e a Tanzânia ao norte?", a: "Rio Lurio", b: "Rio Rovuma", c: "Rio Zambeze", d: "Rio Licungo", correct: "B" }
    ],
    "Difícil": [
      { text: "Qual das seguintes reservas moçambicanas é famosa pela protecção do dugongo e vida marinha?", a: "Arquipélago das Quirimbas", b: "Arquipélago de Bazaruto", c: "Reserva do Niassa", d: "Cabo Delgado", correct: "B" },
      { text: "Qual é o principal recurso mineral extraído na bacia de Moatize em Tete?", a: "Gás Natural", b: "Carvão Mineral", c: "Heavy Sands (Areias Pesadas)", d: "Ouro", correct: "B" },
      { text: "Qual é a corrente marítima quente que banha a costa moçambicana influenciando o clima?", a: "Corrente de Benguela", b: "Corrente de Moçambique", c: "Corrente das Agulhas", d: "Corrente Canária", correct: "B" }
    ]
  },
  "História & Cultura": {
    "Fácil": [
      { text: "Em que ano Moçambique proclamou a sua Independência Nacional?", a: "1964", b: "1975", c: "1992", d: "1980", correct: "B" },
      { text: "Quem foi o primeiro Presidente de Moçambique independente?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Joaquim Chissano", d: "Filipe Nyusi", correct: "A" },
      { text: "Em que data se celebra o Dia da Independência de Moçambique?", a: "25 de Junho", b: "7 de Setembro", c: "3 de Fevereiro", d: "4 de Outubro", correct: "A" }
    ],
    "Médio": [
      { text: "Quem foi apelidado de 'Pai da Nascença da Nação Moçambicana' e fundador da FRELIMO?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Josina Machel", d: "Marcelino dos Santos", correct: "B" },
      { text: "O que marcou a assinatura do Acordo Geral de Paz em Roma a 4 de Outubro de 1992?", a: "Fim da dominação colonial", b: "Fim da guerra civil de 16 anos em Moçambique", c: "Independência das colónias", d: "Adoção da primeira Constituição", correct: "B" },
      { text: "Qual império histórico dominou o vale do Zambeze antes da fixação colonial efectiva?", a: "Império do Monomotapa", b: "Império do Mali", c: "Império Zulu", d: "Reino do Congo", correct: "A" }
    ],
    "Difícil": [
      { text: "Quem foi o líder resistente moçambicano do Estado de Gaza derrotado em Coolela em 1895?", a: "Ngungunhane", b: "Maguiguana", c: "Muzila", d: "Manukosi", correct: "A" },
      { text: "Em que ano foi fundada a FRELIMO em Dar-es-Salaam?", a: "1960", b: "1962", c: "1964", d: "1974", correct: "B" },
      { text: "Onde teve início a Luta Armada de Libertação Nacional a 25 de Setembro de 1964?", a: "Chai (Cabo Delgado)", b: "Mueda", c: "Nachingwea", d: "Lichinga", correct: "A" }
    ]
  },
  "Biologia & Ciências": {
    "Fácil": [
      { text: "Qual é a unidade fundamental da vida em todos os seres vivos?", a: "Átomo", b: "Célula", c: "Tecido", d: "Órgão", correct: "B" },
      { text: "Qual gás os vegetais absorvem durante o processo de fotossíntese?", a: "Oxigénio", b: "Dióxido de Carbono (CO2)", c: "Azoto", d: "Hidrogénio", correct: "B" },
      { text: "Qual é o principal órgão responsável pela bombagem do sangue no corpo humano?", a: "Fígado", b: "Coração", c: "Pulmão", d: "Rim", correct: "B" }
    ],
    "Médio": [
      { text: "Qual organela celular é conhecida como a 'central de energia' da célula eucariótica?", a: "Ribossomo", b: "Mitocôndria", c: "Complexo de Golgi", d: "Lisossomo", correct: "B" },
      { text: "Qual é a função dos glóbulos vermelhos (hemácias) no sangue?", a: "Defesa imunitária", b: "Coagulação do sangue", c: "Transporte de oxigénio", d: "Produção de hormonas", correct: "C" },
      { text: "Na genética mendeliana, o que significa um alelo dominante?", a: "Aquele que se manifesta mesmo em dose simples (heterozigotia)", b: "Aquele que só se manifesta em homozigotia", c: "Aquele que causa mutações letais", d: "Aquele que não se transmite à descendência", correct: "A" }
    ],
    "Difícil": [
      { text: "Qual enzima é responsável por desenrolar e abrir a dupla hélice de DNA durante a replicação?", a: "DNA Polimerase", b: "Helicase", c: "RNA Primase", d: "Ligase", correct: "B" },
      { text: "Qual das seguintes doenças tropicais é transmitida pela picada do mosquito Anopheles feminino?", a: "Cólera", b: "Malária (Paludismo)", c: "Febre Tifóide", d: "Dengue", correct: "B" },
      { text: "O que caracteriza a fase da Meiose I em comparação com a Mitose?", a: "Separação dos cromossomas homólogos e crossing-over", b: "Divisão idêntica em 2 células filhas diplóides", c: "Ausência de duplicação prévia do DNA", d: "Destruição do núcleo celular", correct: "A" }
    ]
  },
  "Ética & Cidadania": {
    "Fácil": [
      { text: "O que significa o conceito de 'Cidadania'?", a: "Conjunto de direitos e deveres de um indivíduo numa sociedade", b: "Apenas o direito de votar nas eleições", c: "Ter uma casa própria na cidade", d: "Trabalhar no sector público", correct: "A" },
      { text: "Qual é o valor moral que consiste em respeitar a opinião e cultura dos outros?", a: "Intolerância", b: "Tolerância", c: "Egoísmo", d: "Preconceito", correct: "B" },
      { text: "Qual destas atitudes contribui para a preservação do meio ambiente escolar?", a: "Deitar lixo no chão", b: "Manter as salas limpas e reciclar residuos", c: "Gastar água sem necessidade", d: "Danificar as carteiras", correct: "B" }
    ],
    "Médio": [
      { text: "Qual é a diferença fundamental entre Ética e Moral?", a: "A Ética é a reflexão teórica sobre os princípios; a Moral é o conjunto de normas práticas culturais", b: "A Ética muda diariamente; a Moral é eterna", c: "Não existe qualquer diferença", d: "A Moral é científica; a Ética é religiosa", correct: "A" },
      { text: "O que é a Declaração Universal dos Direitos Humanos?", a: "Um documento aprovado pela ONU em 1948 defendendo os direitos fundamentais de todos os seres humanos", b: "Uma lei de um único país europeu", c: "Um código comercial internacional", d: "Um tratado militar entre nações", correct: "A" },
      { text: "O que caracteriza a 'Democracia Representativa'?", a: "Os cidadãos elegem representantes para tomar decisões políticas em seu nome", b: "Um único líder governa sem prestar contas", c: "Todos os cidadãos votam diariamente em cada lei", d: "Os líderes são escolhidos por sorteio", correct: "A" }
    ],
    "Difícil": [
      { text: "Na filosofia política de Thomas Hobbes, o que é o 'Contrato Social'?", a: "Um acordo em que os indivíduos cedem parte da sua liberdade ao Estado em troca de segurança e ordem", b: "Um contrato de trabalho entre empregado e patrão", c: "A abolição de qualquer governo ou autoridade", d: "Um tratado religioso", correct: "A" },
      { text: "Qual é o conceito de 'Justiça Distributiva' proposto por John Rawls?", a: "As desigualdades só são aceitáveis se beneficiarem os membros menos favorecidos da sociedade", b: "A distribuição rigorosamente igual de riquezas a todos independentemente do esforço", c: "A lei do mais forte na economia de mercado", d: "A punição igual para todos os crimes", correct: "A" }
    ]
  }
};

function generateQuestions(subject, difficulty, count = 5) {
  let selectedSet = [];

  if (questionsCatalog[subject] && questionsCatalog[subject][difficulty]) {
    selectedSet = questionsCatalog[subject][difficulty];
  } else {
    // Busca em todas as categorias se a específica não for encontrada
    for (let cat of Object.keys(questionsCatalog)) {
      if (questionsCatalog[cat][difficulty]) {
        selectedSet = selectedSet.concat(questionsCatalog[cat][difficulty]);
      }
    }
  }

  // Embaralha e seleciona 'count' perguntas
  const shuffled = [...selectedSet].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

module.exports = {
  questionsCatalog,
  generateQuestions
};
