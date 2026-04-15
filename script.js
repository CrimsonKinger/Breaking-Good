// ===== БАЗА ВОПРОСОВ (статическая, для многократного использования) =====
const QUESTIONS_DB = [
  {
    question: "Какой элемент нужно добавить к Ca, чтобы получить оксид кальция?",
    formula: "",
    options: ["H", "OH", "O", "Другое"],
    correct: 2,
    explanation: "Оксид кальция (CaO) образуется при соединении кальция с кислородом (O). Реакция: 2Ca + O₂ → 2CaO"
  },
  {
    question: "Какова формула воды?",
    formula: "",
    options: ["H₂O", "CO₂", "NaCl", "O₂"],
    correct: 0,
    explanation: "Вода — H₂O, состоит из двух атомов водорода и одного атома кислорода."
  },
  {
    question: "Какой газ выделяется при реакции цинка с соляной кислотой?",
    formula: "Zn + HCl → ZnCl₂ + ?",
    options: ["Кислород (O₂)", "Водород (H₂)", "Хлор (Cl₂)", "Азот (N₂)"],
    correct: 1,
    explanation: "При реакции Zn + 2HCl → ZnCl₂ + H₂↑ выделяется газообразный водород."
  },
  {
    question: "Что нужно добавить к Cl, чтобы получить соляную кислоту?",
    formula: "",
    options: ["H", "HO", "O", "Другое"],
    correct: 0,
    explanation: "Соляная кислота имеет формулу HCl. Это соединение водорода (H) и хлора (Cl)."
  },
  {
    question: "Какой тип реакции: 2H₂ + O₂ → 2H₂O?",
    formula: "2H₂ + O₂ → 2H₂O",
    options: ["Разложения", "Соединения", "Замещения", "Обмена"],
    correct: 1,
    explanation: "Это реакция соединения — из двух простых веществ образуется одно сложное."
  },
  {
    question: "Какой элемент обозначается символом Fe?",
    formula: "",
    options: ["Железо", "Медь", "Фтор", "Франций"],
    correct: 0,
    explanation: "Fe (от лат. Ferrum) — это химический символ железа."
  },
  {
    question: "Какая кислота входит в состав желудочного сока?",
    formula: "",
    options: ["H₂SO₄ (серная)", "HCl (соляная)", "HNO₃ (азотная)", "CH₃COOH (уксусная)"],
    correct: 1,
    explanation: "В желудочном соке содержится соляная кислота (HCl), которая помогает переваривать пищу."
  },
  {
    question: "Сколько всего известных элементов в периодической таблице Менделеева?",
    formula: "",
    options: ["120", "119", "118", "117"],
    correct: 2,
    explanation: "На данный момент подтверждено открытие и именование 118 элементов."
  },
  {
    question: "Какой газ в быту называют «углекислым»?",
    formula: "",
    options: ["CO (угарный газ)", "CO₂ (диоксид углерода)", "CH₄ (метан)", "O₃ (озон)"],
    correct: 1,
    explanation: "«Углекислый газ» — это бытовое название диоксида углерода CO₂."
  },
  {
    question: "Какой элемент обозначается символом Cu?",
    formula: "",
    options: ["Золото", "Водород", "Кремний", "Медь"],
    correct: 3,
    explanation: "Cu (от лат. Cuprum) — это химический символ меди."
  }
];

// ===== УТИЛИТА: Перемешивание массива (алгоритм Фишера-Йейтса) =====
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== СОСТОЯНИЕ ИГРЫ =====
let gameQuestions = []; // Перемешанные вопросы для текущей сессии
let currentQuestion = 0;
let score = 0;
let answers = [];

// ===== DOM-ЭЛЕМЕНТЫ =====
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const qNumber = document.getElementById('q-number');
const questionText = document.getElementById('question-text');
const formulaHint = document.getElementById('formula-hint');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');

const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const bigScore = document.getElementById('big-score');
const resultMessage = document.getElementById('result-message');
const resultDetails = document.getElementById('result-details');

// ===== ПОДГОТОВКА ИГРЫ =====
function prepareGame() {
  // 1. Перемешиваем порядок вопросов
  // 2. Для каждого вопроса перемешиваем варианты ответов
  // 3. Автоматически находим новый индекс правильного ответа
  gameQuestions = shuffleArray(QUESTIONS_DB).map(q => {
    const correctText = q.options[q.correct];
    const shuffledOptions = shuffleArray(q.options);
    return {
      ...q,
      options: shuffledOptions,
      correct: shuffledOptions.indexOf(correctText)
    };
  });
}

// ===== ФУНКЦИИ =====
function switchScreen(hide, show) {
  hide.classList.remove('active');
  show.classList.add('active');
}

function startGame() {
  currentQuestion = 0;
  score = 0;
  answers = [];
  prepareGame(); // 👈 Рандомизация при старте
  switchScreen(startScreen, quizScreen);
  loadQuestion();
}

function loadQuestion() {
  const q = gameQuestions[currentQuestion];

  const progress = ((currentQuestion) / gameQuestions.length) * 100;
  progressBar.style.width = progress + '%';
  questionCounter.textContent = `Вопрос ${currentQuestion + 1} / ${gameQuestions.length}`;
  scoreDisplay.textContent = `⭐ ${score}`;
  qNumber.textContent = `Задание ${currentQuestion + 1}`;
  questionText.textContent = q.question;

  if (q.formula && q.formula.trim() !== '') {
    formulaHint.textContent = q.formula;
    formulaHint.style.display = 'block';
  } else {
    formulaHint.style.display = 'none';
  }

  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  nextBtn.classList.add('hidden');

  optionsContainer.innerHTML = '';
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-number">${index + 1}</span> ${opt}`;
    btn.addEventListener('click', () => selectAnswer(index, btn));
    optionsContainer.appendChild(btn);
  });

  const card = document.querySelector('.question-card');
  card.style.animation = 'none';
  card.offsetHeight; 
  card.style.animation = 'slideIn 0.4s ease';
}

function selectAnswer(index, btn) {
  const q = gameQuestions[currentQuestion];
  const allBtns = optionsContainer.querySelectorAll('.option-btn');
  const isCorrect = index === q.correct;

  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    score++;
    scoreDisplay.textContent = `⭐ ${score}`;
  } else {
    btn.classList.add('wrong');
    allBtns[q.correct].classList.add('correct');
  }

  answers.push({
    question: q.question,
    userAnswer: q.options[index],
    correctAnswer: q.options[q.correct],
    isCorrect: isCorrect
  });

  feedback.classList.remove('hidden', 'correct', 'wrong');
  feedback.classList.add(isCorrect ? 'correct' : 'wrong');
  feedback.innerHTML = isCorrect 
    ? `✅ Верно! ${q.explanation}` 
    : `❌ Неверно. ${q.explanation}`;

  nextBtn.classList.remove('hidden');
  nextBtn.textContent = currentQuestion === gameQuestions.length - 1 ? '📊 Результаты' : 'Далее ➡️';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < gameQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  switchScreen(quizScreen, resultScreen);
  bigScore.textContent = score;
  const percent = (score / gameQuestions.length) * 100;

  if (percent === 100) {
    resultIcon.textContent = '🏆';
    resultTitle.textContent = 'Идеальный результат!';
    resultMessage.textContent = 'Потрясающе! Ты настоящий знаток химии! Все ответы верны! 🔥';
  } else if (percent >= 70) {
    resultIcon.textContent = '👏';
    resultTitle.textContent = 'Отличный результат!';
    resultMessage.textContent = 'Ты очень хорошо разбираешься в химии. Так держать! 💙';
  } else if (percent >= 50) {
    resultIcon.textContent = '📚';
    resultTitle.textContent = 'Хорошо, но есть куда расти';
    resultMessage.textContent = 'Неплохой результат. Повтори материал и попробуй набрать больше!';
  } else {
    resultIcon.textContent = '💪';
    resultTitle.textContent = 'Не сдавайся!';
    resultMessage.textContent = 'Химия требует практики. Изучи теорию и возвращайся за новым рекордом!';
  }

  resultDetails.innerHTML = '<h3 style="margin-bottom: 12px; color: #7dd3fc;">📋 Подробные результаты:</h3>';
  answers.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'detail-item';
    div.innerHTML = `
      <span>В${i + 1}: ${a.isCorrect ? '✅' : '❌'}</span>
      <span class="status ${a.isCorrect ? 'correct' : 'wrong'}">
        ${a.isCorrect ? 'Верно' : a.correctAnswer}
      </span>
    `;
    resultDetails.appendChild(div);
  });
}

// ===== СОБЫТИЯ =====
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', () => switchScreen(resultScreen, startScreen));

// Поддержка клавиш 1-4 для быстрого ответа
document.addEventListener('keydown', (e) => {
  if (!quizScreen.classList.contains('active')) return;
  const key = parseInt(e.key);
  if (key >= 1 && key <= 4) {
    const btns = optionsContainer.querySelectorAll('.option-btn');
    const targetBtn = btns[key - 1];
    if (targetBtn && !targetBtn.disabled) {
      selectAnswer(key - 1, targetBtn);
    }
  }
});
