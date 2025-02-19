const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 100;
const TIME_LIMIT = 15; // 10 seconds timer

// Elements from HTML
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const revealAnswerBtn = document.getElementById('revealAnswerBtn');
const correctAnswer = document.getElementById('correctAnswer');
const timerText = document.getElementById('timer'); // Timer element

// Game state variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let questions = [];
let timeLeft = TIME_LIMIT;
let timerInterval;

revealAnswerBtn.addEventListener('click', () => {
  correctAnswer.innerText = `Correct Answer: ${currentQuestion['choice' + currentQuestion.answer]}`;
  correctAnswer.style.display = 'block';
});

// Retrieve the selected question set from localStorage
const selectedSet = localStorage.getItem('selectedSet'); 

const fetchQuestions = (questionSet) => {
  fetch(`${questionSet}.json`)
    .then((res) => res.json())
    .then((loadedQuestions) => {
      questions = loadedQuestions;
      startGame();
    })
    .catch((err) => {
      console.error("Error fetching questions:", err);
    });
};

if (selectedSet) {
  fetchQuestions(selectedSet); 
} else {
  console.error("No question set selected!");
}

const startGame = () => {
  questionCounter = 0;
  score = 0;
  getNewQuestion();
};

const getNewQuestion = () => {
  if (questionCounter >= MAX_QUESTIONS || questionCounter >= questions.length) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.href = "end.html";
  }

  currentQuestion = questions[questionCounter];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  
  acceptingAnswers = true;
  resetTimer();
};

// Handle answer selection
choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    clearInterval(timerInterval); // Stop timer when user selects an answer
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
      correctAnswer.innerText = "";
    }, 1000);
  });
});

// Increment score
const incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

// Timer Functionality
const resetTimer = () => {
  timeLeft = TIME_LIMIT;
  timerText.innerText = `Time Left: ${timeLeft}s`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      acceptingAnswers = false;
      getNewQuestion(); // Auto-move to the next question
    }
  }, 1000);
};
