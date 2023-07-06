const fetch = require('node-fetch');

const API_URL = 'https://jservice.io/api/random';

async function getRandomTriviaQuestion(category, difficulty) {
  const url = `${API_URL}?category=${category}&value=${getDifficultyValue(difficulty)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.length === 0) {
    throw new Error('No trivia questions found for the selected category and difficulty.');
  }

  const questionData = data[0];
  const question = questionData.question;
  const correctAnswer = questionData.answer;
  const choices = shuffle([...questionData.incorrect_answers, correctAnswer]);

  return {
    question,
    answer: correctAnswer,
    choices,
  };
}

function getDifficultyValue(difficulty) {
  switch (difficulty) {
    case 'Easy':
      return 200;
    case 'Medium':
      return 400;
    case 'Hard':
      return 600;
    default:
      return 200;
  }
}

function getTriviaCategoryOptions() {
  return [
    'General Knowledge',
    'Books',
    'Film',
    'Music',
    'Musicals & Theatre',
    'Television',
    'Video Games',
    'Board Games',
    'Science & Nature',
    'Computers',
    'Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
    'Comics',
    'Gadgets',
    'Anime & Manga',
    'Cartoons & Animations',
  ];
}

function getTriviaDifficultyOptions() {
  return ['Easy', 'Medium', 'Hard'];
}

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

module.exports = {
  getRandomTriviaQuestion,
  getTriviaCategoryOptions,
  getTriviaDifficultyOptions,
};
