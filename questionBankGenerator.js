/**
 * Gerador de Perguntas de Quiz para Olimpiadas ESagrada
 * Disciplinas amplias:
 * - Bíblia & Sagradas Escrituras
 * - Religiões & História das Religiões
 * - Congregação Sagrada Família & Carisma
 * - Educação Moral e Religiosa (EMRC)
 * - Filosofia
 * - Geografia de Moçambique
 * - História de Moçambique & Mundial
 * - Biologia & Ciências Naturais
 * - Língua Portuguesa & Literatura
 * - Matemática & Raciocínio Lógico
 * - Física & Química
 * - Economia & Sociedade
 * - Ética, Cidadania & Direitos Humanos
 * - Cultura Geral & Desporto
 */

const questionsCatalog = {
  "Bíblia & Sagradas Escrituras": {
    "Fácil": [
      { text: "Qual é o primeiro livro da Bíblia no Antigo Testamento?", a: "Êxodo", b: "Génesis", c: "Salmos", d: "Levítico", correct: "B" },
      { text: "Em que cidade nasceu Jesus Cristo segundo os Evangelhos?", a: "Nazaré", b: "Belém", c: "Jerusalém", d: "Cafarnaum", correct: "B" },
      { text: "Quantos Evangelhos principais compõem o Novo Testamento?", a: "2", b: "3", c: "4", d: "12", correct: "C" }
    ],
    "Médio": [
      { text: "Quem escreveu a maioria das Epístolas (cartas) no Novo Testamento?", a: "São Pedro", b: "São Paulo", c: "São João", d: "São Tiago", correct: "B" },
      { text: "Qual dos Apóstolos é conhecido por ter duvidado da Ressurreição de Jesus até ver as marcas?", a: "São Tomé", b: "São Judas Tadeus", c: "Santo André", d: "São Filipe", correct: "A" },
      { text: "Qual Rei de Israel é tradicionalmente considerado o autor de muitos dos Salmos?", a: "Rei Salomão", b: "Rei David", c: "Rei Saul", d: "Rei Baltasar", correct: "B" }
    ],
    "Difícil": [
      { text: "Qual profeta do Antigo Testamento foi levado ao céu num redemoinho com um carro de fogo?", a: "Isaías", b: "Elias", c: "Eliseu", d: "Jeremias", correct: "B" },
      { text: "Em que língua original foi escrito a maior parte do Novo Testamento?", a: "Hebraico", b: "Latim", c: "Grego Koiné", d: "Aramaico", correct: "C" },
      { text: "No livro do Apocalipse, qual é a cidade celeste que desce do céu como noiva adornada?", a: "Nova Jerusalém", b: "Sidão", c: "Babilónia", d: "Antioquia", correct: "A" }
    ]
  },

  "Religiões & História das Religiões": {
    "Fácil": [
      { text: "Qual é a religião monoteísta baseada nos ensinamentos do Alcorão e do Profeta Maomé?", a: "Cristianismo", b: "Islamismo", c: "Hinduismo", d: "Budismo", correct: "B" },
      { text: "Qual é o símbolo principal do Cristianismo?", a: "Crescente com Estrela", b: "Cruz", c: "Roda do Dharma", d: "Estrela de David", correct: "B" },
      { text: "O que caracteriza uma religião monoteísta?", a: "Crença em vários deuses", b: "Crença num único Deus", c: "Negação do mundo espiritual", d: "Adoração exclusiva da natureza", correct: "B" }
    ],
    "Médio": [
      { text: "Qual religião oriental tem Siddharta Gautama como seu fundador espiritual?", a: "Xintoísmo", b: "Budismo", c: "Taoísmo", d: "Jainismo", correct: "B" },
      { text: "Qual é o livro sagrado do Povo Judeu contendo os primeiros 5 livros da Bíblia?", a: "Torá", b: "Vedas", c: "Tripitaka", d: "Avesta", correct: "A" },
      { text: "O que se entende por 'Diálogo Inter-religioso'?", a: "Tentativa de converter todas as religiões numa só", b: "Encontro respeitoso e cooperação entre diferentes tradições religiosas", c: "Debate político sobre o Estado laico", d: "Rejeição das tradições locais", correct: "B" }
    ],
    "Difícil": [
      { text: "Nas religiões tradicionais africanas, qual é o papel dos 'Antepassados' (Ancestrais)?", a: "Intermediários venerados entre o mundo dos vivos e o Divino", b: "Entidades malignas a evitar", c: "Deuses criadores do universo", d: "Lendas sem valor espiritual", correct: "A" },
      { text: "Qual evento do século XVI liderado por Martinho Lutero dividiu o Cristianismo ocidental?", a: "Grande Cisma do Oriente", b: "Reforma Protestante", c: "Concílio de Trento", d: "Cruzadas", correct: "B" }
    ]
  },

  "Congregação Sagrada Família & Carisma": {
    "Fácil": [
      { text: "Quem são os membros que compõem a Sagrada Família de Nazaré?", a: "Abraão, Sara e Isaac", b: "Jesus, Maria e José", c: "Joaquim, Ana e Maria", d: "Pedro, Tiago e João", correct: "B" },
      { text: "Qual é a principal missão educativa e carismática das escolas da Sagrada Família?", a: "Apenas formação militar", b: "Formação integral dos jovens com amor, fé, trabalho e valores morais", c: "Ensino exclusivo de finanças", d: "Formação estritamente desportiva", correct: "B" },
      { text: "Qual destas virtudes é especialmente promovida no espírito da Sagrada Família?", a: "Egoísmo", b: "Acolhimento e fraternidade familiar", c: "Rivalidade", d: "Orgulho", correct: "B" }
    ],
    "Médio": [
      { text: "No modelo da Sagrada Família de Nazaré, qual é o papel de São José?", a: "Guardião da Sagrada Família, homem justo e trabalhador", b: "Rei de Jerusalém", c: "Escriba do templo", d: "Soldado romano", correct: "A" },
      { text: "O que inspira a pedagogia piamartina e das congregações da Sagrada Família para a juventude?", a: "Educar a mente, as mãos (trabalho) e o coração (fé e valores)", b: "Imposição de castigos físicos", c: "Abandono da formação espiritual", d: "Foco único em exames teóricos", correct: "A" }
    ],
    "Difícil": [
      { text: "O que representa o ambiente da 'Oficina de Nazaré' na espiritualidade da Sagrada Família?", a: "A santificação da vida quotidiana através do trabalho simples e da oração", b: "Um centro comercial da Antiguidade", c: "Uma escola de retórica grega", d: "Um palácio real", correct: "A" },
      { text: "Como se traduz o lema do carisma Piamartino e educativo da Sagrada Família aos jovens?", a: "Fé e Trabalho (Ora et Labora / Trabalho e Oração)", b: "Vencer a todo o custo", c: "Ciência sem consciência", d: "Poder e Riqueza", correct: "A" }
    ]
  },

  "Educação Moral e Religiosa (EMRC)": {
    "Fácil": [
      { text: "Qual é a Regra de Ouro presente na maioria das tradições morais e éticas?", a: "Fazer aos outros o que gostarias que te fizessem a ti", b: "Olho por olho, dente por dente", c: "Pensar apenas no benefício próprio", d: "Ignorar quem precisa de ajuda", correct: "A" },
      { text: "O que significa a palavra 'Perdão' nas relações humanas?", a: "Guardar ressentimento para sempre", b: "Libertar o coração da vingança e reconciliar a paz", c: "Esquecer a própria identidade", d: "Exigir pagamento financeiro", correct: "B" }
    ],
    "Médio": [
      { text: "O que são as 'Bem-Aventuranças' proclamadas por Jesus no Sermão da Montanha?", a: "Um conjunto de ensinamentos sobre a verdadeira felicidade espiritual e justiça", b: "Uma lista de impostos da época", c: "Regras de comércio", d: "Orações exclusivas para sacerdotes", correct: "A" }
    ],
    "Difícil": [
      { text: "Na Doutrina Social da Igreja, qual é o significado do princípio da 'Solidariedade'?", a: "A determinação firme de se empenhar pelo bem comum de todos", b: "Dar esmola ocasional sem compromisso", c: "Apenas pagar impostos", d: "Isolamento comunitário", correct: "A" }
    ]
  },

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
      { text: "Na filosofia africana, qual é o conceito ético expresso pela palavra 'Ubuntu'?", a: "Busca do poder político", b: "Eu sou porque nós somos (humanidade compartilhada)", c: "Racionalismo estrito", d: "Acumulação de riqueza material", correct: "B" },
      { text: "Segundo Immanuel Kant, o que é o 'Imperativo Categórico'?", a: "Uma regra baseada na busca pelo prazer individual", b: "Um princípio moral incondicional que deve valer como lei universal", c: "Uma ordem ditada pelo Estado para manter a ordem pública", d: "Uma hipótese científica sobre a ética", correct: "B" }
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
      { text: "Qual é o principal recurso mineral extraído na bacia de Moatize em Tete?", a: "Gás Natural", b: "Carvão Mineral", c: "Heavy Sands (Areias Pesadas)", d: "Ouro", correct: "B" }
    ]
  },

  "História de Moçambique & Mundial": {
    "Fácil": [
      { text: "Em que ano Moçambique proclamou a sua Independência Nacional?", a: "1964", b: "1975", c: "1992", d: "1980", correct: "B" },
      { text: "Quem foi o primeiro Presidente de Moçambique independente?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Joaquim Chissano", d: "Filipe Nyusi", correct: "A" },
      { text: "Em que data se celebra o Dia da Independência de Moçambique?", a: "25 de Junho", b: "7 de Setembro", c: "3 de Fevereiro", d: "4 de Outubro", correct: "A" }
    ],
    "Médio": [
      { text: "Quem foi apelidado de 'Pai da Nascença da Nação Moçambicana' e fundador da FRELIMO?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Josina Machel", d: "Marcelino dos Santos", correct: "B" },
      { text: "O que marcou a assinatura do Acordo Geral de Paz em Roma a 4 de Outubro de 1992?", a: "Fim da dominação colonial", b: "Fim da guerra civil de 16 anos em Moçambique", c: "Independência das colónias", d: "Adoção da primeira Constituição", correct: "B" }
    ],
    "Difícil": [
      { text: "Quem foi o líder resistente moçambicano do Estado de Gaza derrotado em Coolela em 1895?", a: "Ngungunhane", b: "Maguiguana", c: "Muzila", d: "Manukosi", correct: "A" },
      { text: "Onde teve início a Luta Armada de Libertação Nacional a 25 de Setembro de 1964?", a: "Chai (Cabo Delgado)", b: "Mueda", c: "Nachingwea", d: "Lichinga", correct: "A" }
    ]
  },

  "Biologia & Ciências Naturais": {
    "Fácil": [
      { text: "Qual é a unidade fundamental da vida em todos os seres vivos?", a: "Átomo", b: "Célula", c: "Tecido", d: "Órgão", correct: "B" },
      { text: "Qual gás os vegetais absorvem durante o processo de fotossíntese?", a: "Oxigénio", b: "Dióxido de Carbono (CO2)", c: "Azoto", d: "Hidrogénio", correct: "B" }
    ],
    "Médio": [
      { text: "Qual organela celular é conhecida como a 'central de energia' da célula eucariótica?", a: "Ribossomo", b: "Mitocôndria", c: "Complexo de Golgi", d: "Lisossomo", correct: "B" },
      { text: "Qual é a função dos glóbulos vermelhos (hemácias) no sangue?", a: "Defesa imunitária", b: "Coagulação do sangue", c: "Transporte de oxigénio", d: "Produção de hormonas", correct: "C" }
    ],
    "Difícil": [
      { text: "Qual enzima é responsável por desenrolar e abrir a dupla hélice de DNA durante a replicação?", a: "DNA Polimerase", b: "Helicase", c: "RNA Primase", d: "Ligase", correct: "B" }
    ]
  },

  "Matemática & Raciocínio Lógico": {
    "Fácil": [
      { text: "Qual é o resultado da operação: 15 + (6 × 4)?", a: "84", b: "39", c: "44", d: "60", correct: "B" },
      { text: "Quantos graus mede a soma dos ângulos internos de qualquer triângulo?", a: "90°", b: "180°", c: "360°", d: "270°", correct: "B" }
    ],
    "Médio": [
      { text: "Qual é a solução da equação do 1º grau: 3x - 9 = 12?", a: "x = 5", b: "x = 7", c: "x = 3", d: "x = 9", correct: "B" },
      { text: "Qual é o valor de x na igualdade de potências: 2^x = 32?", a: "x = 4", b: "x = 5", c: "x = 6", d: "x = 3", correct: "B" }
    ],
    "Difícil": [
      { text: "Na trigonometria, qual é o valor de sen(30°) + cos(60°)?", a: "1", b: "0.5", c: "1.5", d: "2", correct: "A" },
      { text: "Qual é a derivada da função f(x) = x^3 em relação a x?", a: "3x^2", b: "x^2", c: "3x", d: "x^3/3", correct: "A" }
    ]
  },

  "Língua Portuguesa & Literatura": {
    "Fácil": [
      { text: "Qual das seguintes palavras é um substantivo próprio?", a: "escola", b: "Moçambique", c: "livro", d: "aluno", correct: "B" },
      { text: "Qual é o plural correcto da palavra 'cão'?", a: "cãos", b: "cães", c: "cões", d: "caos", correct: "B" }
    ],
    "Médio": [
      { text: "Qual famoso escritor moçambicano é o autor da obra 'Terra Sonâmbula'?", a: "Mia Couto", b: "Paulina Chiziane", c: "José Craveirinha", d: "Ungulani Ba Ka Khosa", correct: "A" },
      { text: "Qual escritora moçambicana foi a primeira mulher africana a vencer o Prémio Camões (2021)?", a: "Paulina Chiziane", b: "Noémia de Sousa", c: "Lilia Momplé", d: "Sónia Sultuane", correct: "A" }
    ],
    "Difícil": [
      { text: "Quem é considerado o 'Poeta Maior' de Moçambique, autor de 'Kobra' e prémio Camões 1991?", a: "José Craveirinha", b: "Rui de Noronha", c: "Marcelino dos Santos", d: "Orlando Mendes", correct: "A" }
    ]
  },

  "Ética, Cidadania & Direitos Humanos": {
    "Fácil": [
      { text: "O que significa o conceito de 'Cidadania'?", a: "Conjunto de direitos e deveres de um indivíduo numa sociedade", b: "Apenas o direito de votar", c: "Ter uma casa na cidade", d: "Trabalhar no governo", correct: "A" },
      { text: "Qual é o valor moral que consiste em respeitar a opinião e cultura dos outros?", a: "Intolerância", b: "Tolerância", c: "Egoísmo", d: "Preconceito", correct: "B" }
    ],
    "Médio": [
      { text: "Qual é a diferença fundamental entre Ética e Moral?", a: "A Ética é a reflexão teórica sobre os princípios; a Moral é o conjunto de normas práticas culturais", b: "A Ética muda diariamente; a Moral é eterna", c: "Não existe diferença", d: "A Moral é científica; a Ética é religiosa", correct: "A" }
    ],
    "Difícil": [
      { text: "O que caracteriza a 'Justiça Distributiva' na sociedade?", a: "Garantir a justa repartição de recursos e oportunidades para os cidadãos", b: "Apenas aplicar penas criminais", c: "Cobrar taxas iguais a todos", d: "Privatizar todos os bens públicos", correct: "A" }
    ]
  },

  "Cultura Geral & Desporto": {
    "Fácil": [
      { text: "Qual é a alcunha oficial da Selecção Nacional de Futebol de Moçambique?", a: "Os Palancas Negras", b: "Os Mambas", c: "Os Leões de Inhambane", d: "Os Tubarões Azuis", correct: "B" },
      { text: "Qual atleta moçambicana conquistou a medalha de Ouro nos 800m nos Jogos Olímpicos de Sydney 2000?", a: "Lurdes Mutola", b: "Josina Machel", c: "Maria de Lurdes", d: "Alcinda Panguana", correct: "A" }
    ],
    "Médio": [
      { text: "Qual é o oceano que banha toda a costa oriental de Moçambique?", a: "Oceano Atlântico", b: "Oceano Pacífico", c: "Oceano Índico", d: "Oceano Glacial Antártico", correct: "C" }
    ],
    "Difícil": [
      { text: "Em que ano foi realizada a primeira edição da Copa das Nações Africanas (CAN) de futebol?", a: "1957", b: "1962", c: "1975", d: "1980", correct: "A" }
    ]
  }
};

function generateQuestions(subject, difficulty, count = 5) {
  let selectedSet = [];

  if (questionsCatalog[subject] && questionsCatalog[subject][difficulty]) {
    selectedSet = questionsCatalog[subject][difficulty];
  } else {
    // Busca em todas as categorias se a específica não for encontrada ou tenta parcial
    for (let cat of Object.keys(questionsCatalog)) {
      if (cat.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(cat.toLowerCase())) {
        if (questionsCatalog[cat][difficulty]) {
          selectedSet = selectedSet.concat(questionsCatalog[cat][difficulty]);
        }
      }
    }
    // Se ainda vazio, junta tudo do nível
    if (selectedSet.length === 0) {
      for (let cat of Object.keys(questionsCatalog)) {
        if (questionsCatalog[cat][difficulty]) {
          selectedSet = selectedSet.concat(questionsCatalog[cat][difficulty]);
        }
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
