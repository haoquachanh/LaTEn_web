import { Question } from '../types';

// Base questions without type and content
const baseQuestions = [
  {
    question: 'Which of the following is the correct form of the present perfect tense?',
    answers: ['I have went', 'I have gone', 'I had gone', 'I will have gone'],
    correctAnswer: 'I have gone',
    id: '1',
  },
  {
    question: 'What is the opposite of "difficult"?',
    answers: ['Hard', 'Easy', 'Complex', 'Tough'],
    correctAnswer: 'Easy',
    id: '2',
  },
  {
    question: 'Which word is a synonym for "happy"?',
    answers: ['Sad', 'Angry', 'Joyful', 'Tired'],
    correctAnswer: 'Joyful',
    id: '3',
  },
  {
    question: 'Choose the correct article: "___ university"',
    answers: ['A', 'An', 'The', 'No article'],
    correctAnswer: 'A',
    id: '4',
  },
  {
    question: 'What does "procrastinate" mean?',
    answers: ['To do immediately', 'To delay', 'To organize', 'To complete'],
    correctAnswer: 'To delay',
    id: '5',
  },
  {
    question: 'Which sentence is grammatically correct?',
    answers: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      'She not like coffee.',
    ],
    correctAnswer: "She doesn't like coffee.",
    id: '6',
  },
  {
    question: 'What is the past tense of "go"?',
    answers: ['Goed', 'Gone', 'Went', 'Going'],
    correctAnswer: 'Went',
    id: '7',
  },
  {
    question: 'Choose the correct comparative form of "good"',
    answers: ['Gooder', 'More good', 'Better', 'Best'],
    correctAnswer: 'Better',
    id: '8',
  },
  {
    question: 'Which word is NOT a preposition?',
    answers: ['On', 'Under', 'Before', 'Running'],
    correctAnswer: 'Running',
    id: '9',
  },
  {
    question: 'What is the plural form of "child"?',
    answers: ['Childs', 'Childes', 'Children', 'Childern'],
    correctAnswer: 'Children',
    id: '10',
  },
  {
    question: 'Choose the correct spelling',
    answers: ['Recieve', 'Receive', 'Receeve', 'Receve'],
    correctAnswer: 'Receive',
    id: '11',
  },
  {
    question: 'Which word is a countable noun?',
    answers: ['Water', 'Bread', 'Rice', 'Book'],
    correctAnswer: 'Book',
    id: '12',
  },
  {
    question: 'What is the meaning of "ubiquitous"?',
    answers: ['Found everywhere', 'Very rare', 'Extremely large', 'Completely transparent'],
    correctAnswer: 'Found everywhere',
    id: '13',
  },
  {
    question: 'The idiom "piece of cake" means:',
    answers: ['Something delicious', 'Something very easy', 'Something incomplete', 'Something sweet'],
    correctAnswer: 'Something very easy',
    id: '14',
  },
  {
    question: 'Complete the sentence: "If I _____ rich, I would buy a mansion."',
    answers: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    id: '15',
  },
  {
    question: 'Which of these is NOT a phrasal verb?',
    answers: ['Look up', 'Turn down', 'Give away', 'Beautiful'],
    correctAnswer: 'Beautiful',
    id: '16',
  },
  {
    question: 'What does the prefix "un-" typically indicate?',
    answers: ['Repetition', 'Negation', 'Greatness', 'Together'],
    correctAnswer: 'Negation',
    id: '17',
  },
  {
    question: 'Choose the sentence with correct punctuation:',
    answers: ['Where are you going?', 'Where are you going.', 'Where, are you going?', 'Where are you going!'],
    correctAnswer: 'Where are you going?',
    id: '18',
  },
  {
    question: 'What is the correct order of adjectives in English?',
    answers: [
      'Opinion, size, age, shape, color, origin, material, purpose',
      'Size, color, age, shape, origin, material, purpose, opinion',
      'Purpose, material, origin, shape, age, size, color, opinion',
      'Opinion, purpose, material, origin, age, shape, size, color',
    ],
    correctAnswer: 'Opinion, size, age, shape, color, origin, material, purpose',
    id: '19',
  },
  {
    question: 'Which of the following is a subordinating conjunction?',
    answers: ['And', 'But', 'Or', 'Although'],
    correctAnswer: 'Although',
    id: '20',
  },
];

// Add type and content to all questions to match the updated Question type
export const sampleQuestions: Question[] = baseQuestions.map((q, index) => {
  // Alternate between multiple choice and true/false for variety
  const type = index % 3 === 0 ? 'truefalse' : 'multiple';

  // Alternate between different content types
  let content;
  if (index % 4 === 0) content = 'grammar';
  else if (index % 4 === 1) content = 'vocabulary';
  else if (index % 4 === 2) content = 'reading';
  else content = 'listening';

  return {
    ...q,
    type,
    content,
  };
});
