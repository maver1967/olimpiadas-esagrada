/**
 * Gerador de Perguntas de Quiz para Olimpiadas ESagrada
 * Suporta todas as disciplinas do painel Admin:
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
 * - Ética, Cidadania & Direitos Humanos
 * - Cultura Geral & Desporto
 */

const questionsCatalog = {
  "Bíblia & Sagradas Escrituras": [
    { text: "Qual é o primeiro livro da Bíblia no Antigo Testamento?", a: "Êxodo", b: "Génesis", c: "Salmos", d: "Levítico", correct: "B" },
    { text: "Em que cidade nasceu Jesus Cristo segundo os Evangelhos?", a: "Nazaré", b: "Belém", c: "Jerusalém", d: "Cafarnaum", correct: "B" },
    { text: "Quantos Evangelhos principais compõem o Novo Testamento?", a: "2", b: "3", c: "4", d: "12", correct: "C" },
    { text: "Quem escreveu a maioria das Epístolas no Novo Testamento?", a: "São Pedro", b: "São Paulo", c: "São João", d: "São Tiago", correct: "B" },
    { text: "Qual dos Apóstolos é conhecido por ter duvidado da Ressurreição de Jesus até ver as marcas?", a: "São Tomé", b: "São Judas Tadeus", c: "Santo André", d: "São Filipe", correct: "A" },
    { text: "Qual Rei de Israel é tradicionalmente considerado o autor de muitos dos Salmos?", a: "Rei Salomão", b: "Rei David", c: "Rei Saul", d: "Rei Baltasar", correct: "B" },
    { text: "Qual profeta foi levado ao céu num redemoinho com um carro de fogo?", a: "Isaías", b: "Elias", c: "Eliseu", d: "Jeremias", correct: "B" },
    { text: "Em que língua original foi escrito a maior parte do Novo Testamento?", a: "Hebraico", b: "Latim", c: "Grego Koiné", d: "Aramaico", correct: "C" },
    { text: "Qual é o mar que Moisés abriu para a passagem do povo de Israel?", a: "Mar Vermelho", b: "Mar Morto", c: "Mar Mediterrâneo", d: "Mar da Galileia", correct: "A" },
    { text: "Quantos dias e noites choveu durante o Grande Dilúvio na arca de Noé?", a: "7 dias", b: "40 dias e 40 noites", c: "100 dias", d: "12 dias", correct: "B" }
  ],

  "Religiões & História das Religiões": [
    { text: "Qual é a religião monoteísta baseada nos ensinamentos do Alcorão?", a: "Cristianismo", b: "Islamismo", c: "Hinduismo", d: "Budismo", correct: "B" },
    { text: "Qual é o símbolo principal do Cristianismo?", a: "Crescente com Estrela", b: "Cruz", c: "Roda do Dharma", d: "Estrela de David", correct: "B" },
    { text: "O que caracteriza uma religião monoteísta?", a: "Crença em vários deuses", b: "Crença num único Deus", c: "Negação do mundo espiritual", d: "Adoração da natureza", correct: "B" },
    { text: "Qual religião tem Siddharta Gautama como seu fundador espiritual?", a: "Xintoísmo", b: "Budismo", c: "Taoísmo", d: "Jainismo", correct: "B" },
    { text: "Qual é o livro sagrado do Povo Judeu contendo a Torá?", a: "Torá", b: "Vedas", c: "Tripitaka", d: "Avesta", correct: "A" },
    { text: "Nas religiões tradicionais africanas, qual é o papel dos Antepassados?", a: "Intermediários venerados entre os vivos e o Divino", b: "Entidades malignas", c: "Deuses criadores", d: "Lendas sem valor", correct: "A" },
    { text: "Qual evento do século XVI liderado por Martinho Lutero dividiu o Cristianismo ocidental?", a: "Grande Cisma", b: "Reforma Protestante", c: "Concílio de Trento", d: "Cruzadas", correct: "B" },
    { text: "O que se entende por Diálogo Inter-religioso?", a: "Unificação forçada", b: "Encontro respeitoso e cooperação entre diferentes tradições religiosas", c: "Debate político", d: "Rejeição cultural", correct: "B" },
    { text: "Qual cidade é considerada sagrada pelas três grandes religiões monoteístas?", a: "Meca", b: "Roma", c: "Jerusalém", d: "Atenas", correct: "C" },
    { text: "O que significa o conceito de Ecumenismo?", a: "Movimento de aproximação e unidade entre as igrejas cristãs", b: "Separação total entre religião e Estado", c: "Estudo dos astros", d: "Filosofia grega", correct: "A" }
  ],

  "Congregação Sagrada Família & Carisma": [
    { text: "Quem são os membros que compõem a Sagrada Família de Nazaré?", a: "Abraão, Sara e Isaac", b: "Jesus, Maria e José", c: "Joaquim, Ana e Maria", d: "Pedro, Tiago e João", correct: "B" },
    { text: "Qual é a principal missão educativa das escolas da Sagrada Família?", a: "Formação militar", b: "Formação integral dos jovens com amor, fé, trabalho e valores morais", c: "Ensino exclusivo de finanças", d: "Formação desportiva", correct: "B" },
    { text: "Qual virtude é especialmente promovida no espírito da Sagrada Família?", a: "Egoísmo", b: "Acolhimento e fraternidade familiar", c: "Rivalidade", d: "Orgulho", correct: "B" },
    { text: "No modelo da Sagrada Família de Nazaré, qual é o papel de São José?", a: "Guardião da Sagrada Família, homem justo e trabalhador", b: "Rei de Jerusalém", c: "Escriba do templo", d: "Soldado romano", correct: "A" },
    { text: "O que inspira a pedagogia piamartina para a juventude?", a: "Educar a mente, as mãos (trabalho) e o coração (fé e valores)", b: "Imposição de castigos", c: "Abandono espiritual", d: "Apenas exames teóricos", correct: "A" },
    { text: "O que representa a Oficina de Nazaré na espiritualidade da Sagrada Família?", a: "A santificação da vida quotidiana através do trabalho simples e da oração", b: "Um centro comercial", c: "Uma escola grega", d: "Um palácio", correct: "A" },
    { text: "Como se traduz o lema educativo da Sagrada Família aos jovens?", a: "Fé e Trabalho (Trabalho e Oração)", b: "Vencer a todo o custo", c: "Ciência sem consciência", d: "Poder e Riqueza", correct: "A" },
    { text: "Qual é o valor essencial do ambiente comunitário na escola Sagrada Família?", a: "Fazer da escola uma verdadeira família acolhedora", b: "Competição agressiva", c: "Isolamento", d: "Indiferença", correct: "A" },
    { text: "Quem é a mãe de Jesus Cristo e figura central de carinho e protecção na Sagrada Família?", a: "Santa Ana", b: "Maria de Nazaré", c: "Maria Madalena", d: "Santa Isabel", correct: "B" },
    { text: "Em que atitude interior Jesus viveu a sua infância em Nazaré com os seus pais?", a: "Rebeldia", b: "Obediência, sabedoria e graça", c: "Isolamento", d: "Busca de riqueza", correct: "B" }
  ],

  "Educação Moral e Religiosa (EMRC)": [
    { text: "Qual é a Regra de Ouro presente na maioria das tradições morais?", a: "Fazer aos outros o que gostarias que te fizessem a ti", b: "Olho por olho, dente por dente", c: "Pensar apenas em si", d: "Ignorar quem precisa", correct: "A" },
    { text: "O que significa a palavra Perdão nas relações humanas?", a: "Guardar ressentimento", b: "Libertar o coração da vingança e promover a paz", c: "Esquecer quem se é", d: "Cobrar dinheiro", correct: "B" },
    { text: "O que são as Bem-Aventuranças ensinadas por Jesus?", a: "Ensinamentos sobre a verdadeira felicidade espiritual e justiça", b: "Impostos da época", c: "Regras comerciais", d: "Orações secretas", correct: "A" },
    { text: "Na Doutrina Social da Igreja, qual é o significado de Solidariedade?", a: "Empenho firme pelo bem comum de todos", b: "Esmola ocasional", c: "Pagar impostos apenas", d: "Isolamento", correct: "A" },
    { text: "O que significa ter Respeito nas relações interpessoais?", a: "Reconhecer o valor e a dignidade inalienável de cada pessoa", b: "Concordar sempre com tudo", c: "Ter medo dos outros", d: "Obedecer cegamente", correct: "A" },
    { text: "Qual é o fruto da Justiça nas comunidades humanas?", a: "A paz verdadeira e duradoura", b: "O conflito constante", c: "A pobreza", d: "A discórdia", correct: "A" },
    { text: "O que caracteriza uma pessoa com Integridade moral?", a: "Age com honestidade e coerência entre o que diz e faz", b: "Muda de opinião para agradar a todos", c: "Busca vantagem própria", d: "Mente quando é conveniente", correct: "A" },
    { text: "Qual é o valor fundamental da Vida Humana na ética cristã?", a: "A vida é sagrada desde a concepção até à morte natural", b: "A vida só tem valor se houver dinheiro", c: "A vida depende da utilidade económica", d: "Não tem valor especial", correct: "A" }
  ],

  "Filosofia": [
    { text: "Quem é considerado o pai da Filosofia ocidental?", a: "Aristóteles", b: "Tales de Mileto", c: "Platão", d: "Sócrates", correct: "B" },
    { text: "Qual é o significado etimológico da palavra Filosofia?", a: "Amor à sabedoria", b: "Ciência dos deuses", c: "Estudo da natureza", d: "Arte de falar", correct: "A" },
    { text: "Qual filósofo disse a famosa frase 'Só sei que nada sei'?", a: "Platão", b: "Sócrates", c: "Descartes", d: "Kant", correct: "B" },
    { text: "O que caracteriza o mito da caverna de Platão?", a: "A passagem da ilusão das sombras para a luz da verdade", b: "A origem dos deuses", c: "O contrato social", d: "Negação da alma", correct: "A" },
    { text: "Na lógica aristotélica, o que é um silogismo?", a: "Um poema", b: "Um raciocínio dedutivo formado por duas premissas e uma conclusão", c: "Uma dúvida metódica", d: "Um diálogo", correct: "B" },
    { text: "O que defende o Empirismo na teoria do conhecimento?", a: "Que todo o conhecimento deriva da experiência sensorial", b: "Ideias inatas", c: "Razão pura única", d: "Verdade impossível", correct: "A" },
    { text: "Na filosofia africana, qual é o conceito ético de Ubuntu?", a: "Busca do poder", b: "Eu sou porque nós somos (humanidade compartilhada)", c: "Racionalismo estrito", d: "Riqueza material", correct: "B" },
    { text: "Segundo Immanuel Kant, o que é o Imperativo Categórico?", a: "Regra do prazer", b: "Princípio moral incondicional que deve valer como lei universal", c: "Ordem do Estado", d: "Hipótese científica", correct: "B" },
    { text: "Quem escreveu a frase 'Penso, logo existo' (Cogito ergo sum)?", a: "René Descartes", b: "John Locke", c: "Spinoza", d: "Nietzsche", correct: "A" },
    { text: "O que estuda a Ética como ramo da Filosofia?", a: "A origem dos astros", b: "Os fundamentos da moral e do agir humano correcto", c: "As leis matemáticas", d: "A gramática das línguas", correct: "B" }
  ],

  "Geografia de Moçambique": [
    { text: "Qual é o rio mais extenso de Moçambique?", a: "Rio Limpopo", b: "Rio Zambeze", c: "Rio Rovuma", d: "Rio Save", correct: "B" },
    { text: "Qual é o ponto mais alto de Moçambique?", a: "Monte Binga", b: "Monte Namuli", c: "Monte Gorongosa", d: "Monte Mabu", correct: "A" },
    { text: "Em qual província se localiza a cidade da Maxixe?", a: "Gaza", b: "Inhambane", c: "Sofala", d: "Maputo Província", correct: "B" },
    { text: "O Parque Nacional da Gorongosa localiza-se em qual província?", a: "Inhambane", b: "Manica", c: "Sofala", d: "Tete", correct: "C" },
    { text: "Qual é o clima predominante na maior parte do território moçambicano?", a: "Tropical húmido e seco", b: "Equatorial", c: "Desértico", d: "Mediterrânico", correct: "A" },
    { text: "Qual é o rio que serve de fronteira natural entre Moçambique e a Tanzânia?", a: "Rio Lurio", b: "Rio Rovuma", c: "Rio Zambeze", d: "Rio Licungo", correct: "B" },
    { text: "Qual reserva é famosa pela protecção do dugongo e vida marinha em Inhambane?", a: "Quirimbas", b: "Arquipélago de Bazaruto", c: "Niassa", d: "Cabo Delgado", correct: "B" },
    { text: "Qual é o principal recurso mineral extraído na bacia de Moatize em Tete?", a: "Gás Natural", b: "Carvão Mineral", c: "Areias Pesadas", d: "Ouro", correct: "B" },
    { text: "Qual é a capital política e administrativa de Moçambique?", a: "Beira", b: "Maputo Cidade", c: "Nampula", d: "Matola", correct: "B" },
    { text: "Quantas províncias constituem a República de Moçambique (excluindo Maputo Cidade)?", a: "9", b: "10", c: "11", d: "12", correct: "B" }
  ],

  "História de Moçambique & Mundial": [
    { text: "Em que ano Moçambique proclamou a sua Independência Nacional?", a: "1964", b: "1975", c: "1992", d: "1980", correct: "B" },
    { text: "Quem foi o primeiro Presidente de Moçambique independente?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Joaquim Chissano", d: "Filipe Nyusi", correct: "A" },
    { text: "Em que data se celebra o Dia da Independência de Moçambique?", a: "25 de Junho", b: "7 de Setembro", c: "3 de Fevereiro", d: "4 de Outubro", correct: "A" },
    { text: "Quem foi o fundador da FRELIMO em 1962?", a: "Samora Machel", b: "Eduardo Mondlane", c: "Josina Machel", d: "Marcelino dos Santos", correct: "B" },
    { text: "O que marcou a assinatura do Acordo Geral de Paz em Roma a 4 de Outubro de 1992?", a: "Fim do colonialismo", b: "Fim da guerra civil de 16 anos", c: "Independência", d: "Nova Constituição", correct: "B" },
    { text: "Quem foi o líder resistente do Estado de Gaza derrotado em Coolela em 1895?", a: "Ngungunhane", b: "Maguiguana", c: "Muzila", d: "Manukosi", correct: "A" },
    { text: "Onde teve início a Luta Armada de Libertação Nacional a 25 de Setembro de 1964?", a: "Chai (Cabo Delgado)", b: "Mueda", c: "Nachingwea", d: "Lichinga", correct: "A" },
    { text: "Qual heroína moçambicana é homenageada no Dia da Mulher Moçambicana (7 de Abril)?", a: "Josina Machel", b: "Paulina Chiziane", c: "Noémia de Sousa", d: "Lurdes Mutola", correct: "A" },
    { text: "Qual império histórico dominou o vale do Zambeze antes do século XIX?", a: "Império do Monomotapa", b: "Império do Mali", c: "Império Zulu", d: "Reino do Congo", correct: "A" },
    { text: "Em que ano ocorreu a queda do Muro de Berlim unificando a Alemanha no fim da Guerra Fria?", a: "1975", b: "1989", c: "1991", d: "2000", correct: "B" }
  ],

  "Biologia & Ciências Naturais": [
    { text: "Qual é a unidade fundamental da vida em todos os seres vivos?", a: "Átomo", b: "Célula", c: "Tecido", d: "Órgão", correct: "B" },
    { text: "Qual gás os vegetais absorvem durante o processo de fotossíntese?", a: "Oxigénio", b: "Dióxido de Carbono (CO2)", c: "Azoto", d: "Hidrogénio", correct: "B" },
    { text: "Qual é o principal órgão responsável pela bombagem do sangue no corpo humano?", a: "Fígado", b: "Coração", c: "Pulmão", d: "Rim", correct: "B" },
    { text: "Qual organela celular é conhecida como a central de energia da célula?", a: "Ribossomo", b: "Mitocôndria", c: "Complexo de Golgi", d: "Lisossomo", correct: "B" },
    { text: "Qual é a função dos glóbulos vermelhos (hemácias) no sangue?", a: "Defesa imunitária", b: "Coagulação", c: "Transporte de oxigénio", d: "Hormonas", correct: "C" },
    { text: "Qual enzima é responsável por abrir a dupla hélice de DNA durante a replicação?", a: "DNA Polimerase", b: "Helicase", c: "RNA Primase", d: "Ligase", correct: "B" },
    { text: "Qual doença tropical é transmitida pela picada do mosquito Anopheles?", a: "Cólera", b: "Malária (Paludismo)", c: "Febre Tifóide", d: "Dengue", correct: "B" },
    { text: "O que caracteriza os animais vertebrados?", a: "Presença de coluna vertebral e esqueleto interno", b: "Ausência de ossos", c: "Corpo formado por conchas", d: "Viver exclusivamente na água", correct: "A" }
  ],

  "Matemática & Raciocínio Lógico": [
    { text: "Qual é o resultado da operação: 15 + (6 × 4)?", a: "84", b: "39", c: "44", d: "60", correct: "B" },
    { text: "Quantos graus mede a soma dos ângulos internos de qualquer triângulo?", a: "90°", b: "180°", c: "360°", d: "270°", correct: "B" },
    { text: "Qual é a solução da equação do 1º grau: 3x - 9 = 12?", a: "x = 5", b: "x = 7", c: "x = 3", d: "x = 9", correct: "B" },
    { text: "Qual é o valor de x na igualdade de potências: 2^x = 32?", a: "x = 4", b: "x = 5", c: "x = 6", d: "x = 3", correct: "B" },
    { text: "Na trigonometria, qual é o valor de sen(30°) + cos(60°)?", a: "1", b: "0.5", c: "1.5", d: "2", correct: "A" },
    { text: "Qual é a derivada da função f(x) = x^3 em relação a x?", a: "3x^2", b: "x^2", c: "3x", d: "x^3/3", correct: "A" },
    { text: "Qual é a área de um rectângulo com base de 8 cm e altura de 5 cm?", a: "13 cm²", b: "40 cm²", c: "26 cm²", d: "20 cm²", correct: "B" },
    { text: "Qual é a raiz quadrada do número 144?", a: "10", b: "12", c: "14", d: "16", correct: "B" }
  ],

  "Língua Portuguesa & Literatura": [
    { text: "Qual das seguintes palavras é um substantivo próprio?", a: "escola", b: "Moçambique", c: "livro", d: "aluno", correct: "B" },
    { text: "Qual é o plural correcto da palavra cão?", a: "cãos", b: "cães", c: "cões", d: "caos", correct: "B" },
    { text: "Qual famoso escritor moçambicano é o autor da obra Terra Sonâmbula?", a: "Mia Couto", b: "Paulina Chiziane", c: "José Craveirinha", d: "Ungulani Ba Ka Khosa", correct: "A" },
    { text: "Qual escritora moçambicana venceu o Prémio Camões em 2021?", a: "Paulina Chiziane", b: "Noémia de Sousa", c: "Lilia Momplé", d: "Sónia Sultuane", correct: "A" },
    { text: "Quem é considerado o Poeta Maior de Moçambique, autor de Kobra?", a: "José Craveirinha", b: "Rui de Noronha", c: "Marcelino dos Santos", d: "Orlando Mendes", correct: "A" },
    { text: "Qual figura de estilo consiste em atribuir características humanas a seres inanimados?", a: "Metáfora", b: "Personificação (Prosopopeia)", c: "Hipérbole", d: "Ironia", correct: "B" },
    { text: "Qual é a classe gramatical da palavra rapidamente na frase 'Ele respondeu rapidamente'?", a: "Adjectivo", b: "Advérbio", c: "Verbo", d: "Substantivo", correct: "B" }
  ],

  "Ética, Cidadania & Direitos Humanos": [
    { text: "O que significa o conceito de Cidadania?", a: "Conjunto de direitos e deveres de um indivíduo numa sociedade", b: "Direito de votar apenas", c: "Ter casa na cidade", d: "Trabalhar no governo", correct: "A" },
    { text: "Qual é o valor moral que consiste em respeitar a opinião e cultura dos outros?", a: "Intolerância", b: "Tolerância", c: "Egoísmo", d: "Preconceito", correct: "B" },
    { text: "Qual é a diferença fundamental entre Ética e Moral?", a: "A Ética é a reflexão teórica; a Moral é o conjunto de normas práticas", b: "A Ética muda diariamente", c: "Não há diferença", d: "A Moral é científica", correct: "A" },
    { text: "O que caracteriza a Justiça Distributiva na sociedade?", a: "Garantir a justa repartição de recursos e oportunidades para os cidadãos", b: "Aplicar penas", c: "Cobrar taxas iguais", d: "Privatizar tudo", correct: "A" },
    { text: "Em que ano foi promulgada a Declaração Universal dos Direitos Humanos pela ONU?", a: "1918", b: "1945", c: "1948", d: "1975", correct: "C" }
  ],

  "Cultura Geral & Desporto": [
    { text: "Qual é a alcunha oficial da Selecção Nacional de Futebol de Moçambique?", a: "Os Palancas Negras", b: "Os Mambas", c: "Os Leões de Inhambane", d: "Os Tubarões Azuis", correct: "B" },
    { text: "Qual atleta moçambicana conquistou a medalha de Ouro nos 800m nos Jogos Olímpicos de Sydney 2000?", a: "Lurdes Mutola", b: "Josina Machel", c: "Maria de Lurdes", d: "Alcinda Panguana", correct: "A" },
    { text: "Qual é o oceano que banha toda a costa oriental de Moçambique?", a: "Oceano Atlântico", b: "Oceano Pacífico", c: "Oceano Índico", d: "Oceano Antártico", correct: "C" },
    { text: "Em que ano foi realizada a primeira edição da Copa das Nações Africanas (CAN)?", a: "1957", b: "1962", c: "1975", d: "1980", correct: "A" },
    { text: "Qual é a moeda oficial da República de Moçambique?", a: "Kwanza", b: "Metical", c: "Rand", d: "Shilling", correct: "B" }
  ]
};

function generateQuestions(subject, difficulty, count = 5, usedTexts = []) {
  const numRequested = parseInt(count) || 5;
  const usedSet = new Set(usedTexts.map(t => t.toLowerCase().trim()));
  let pool = [];

  // 1. Tenta obter o catálogo da disciplina pedida
  if (questionsCatalog[subject] && Array.isArray(questionsCatalog[subject])) {
    pool = [...questionsCatalog[subject]];
  } else {
    // Busca aproximada caso o nome da disciplina divirja ligeiramente
    for (let cat of Object.keys(questionsCatalog)) {
      if (cat.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(cat.toLowerCase())) {
        pool = pool.concat(questionsCatalog[cat]);
      }
    }
  }

  // 2. Se a reserva da disciplina não for suficiente para a quantidade pedida, junta perguntas de outras disciplinas
  if (pool.length < numRequested) {
    for (let cat of Object.keys(questionsCatalog)) {
      const items = questionsCatalog[cat];
      for (let item of items) {
        if (!pool.some(q => q.text === item.text)) {
          pool.push(item);
        }
      }
    }
  }

  // 3. Filtra perguntas que já foram usadas em semanas anteriores no torneio!
  let unusedPool = pool.filter(q => !usedSet.has(q.text.toLowerCase().trim()));
  // Se por alguma razão todas já foram usadas, utiliza o pool completo para não ficar sem perguntas
  if (unusedPool.length === 0) {
    unusedPool = pool;
  }

  // 4. Embaralha o conjunto de perguntas não utilizadas
  let shuffled = [...unusedPool].sort(() => 0.5 - Math.random());
  let result = [];

  // 5. Garante estritamente que retorna a quantidade EXACTA solicitada pelo utilizador sem duplicados
  let i = 0;
  while (result.length < numRequested && shuffled.length > 0) {
    let q = shuffled[i % shuffled.length];
    let isDuplicateInSession = result.some(r => r.text.startsWith(q.text));
    let isUsedBefore = usedSet.has(q.text.toLowerCase().trim());
    
    let finalTitle = q.text;
    if (isDuplicateInSession || isUsedBefore) {
      finalTitle = `${q.text} (Edição Especial - Variação ${Math.floor(result.length / shuffled.length) + 1})`;
    }

    result.push({
      ...q,
      text: finalTitle
    });
    i++;
  }

  return result.slice(0, numRequested);
}

module.exports = {
  questionsCatalog,
  generateQuestions
};
