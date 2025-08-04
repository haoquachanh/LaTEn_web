import { DataSource } from 'typeorm';
import { QuestionCategory } from '../entities/question-category.entity';
import { QuestionBank } from '../entities/question-bank.entity';
import { Question, QuestionType, QuestionFormat, DifficultyLevel, QuestionMode } from '../entities/question.entity';

export async function seedQuestionData(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(QuestionCategory);
  const bankRepository = dataSource.getRepository(QuestionBank);
  const questionRepository = dataSource.getRepository(Question);

  // Seed Categories
  const categories = [
    {
      name: 'Grammar',
      description: 'Grammar-related questions for Latin language learning',
    },
    {
      name: 'Vocabulary',
      description: 'Vocabulary and word meaning questions',
    },
    {
      name: 'Reading Comprehension',
      description: 'Text understanding and interpretation questions',
    },
    {
      name: 'Listening',
      description: 'Audio-based comprehension questions',
    },
    {
      name: 'Translation',
      description: 'Latin to Vietnamese/English translation questions',
    },
  ];

  const savedCategories = await categoryRepository.save(categories);
  console.log('✅ Categories seeded successfully');

  // Sample Questions for different types and difficulties
  const sampleQuestions = [
    // Original Latin questions
    {
      content: 'What is the meaning of "amor" in Latin?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      mode: QuestionMode.READING,
      difficultyLevel: DifficultyLevel.LEVEL_1,
      options: ['Love', 'War', 'Peace', 'Wisdom'],
      correctAnswer: 'Love',
      explanation: '"Amor" is the Latin word for love.',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },

    // Import frontend sample questions
    {
      content: 'Which of the following is the correct form of the present perfect tense?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      mode: QuestionMode.READING,
      difficultyLevel: DifficultyLevel.LEVEL_2,
      options: ['I have went', 'I have gone', 'I had gone', 'I will have gone'],
      correctAnswer: 'I have gone',
      explanation: 'The present perfect of "go" is formed with "have gone".',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'What is the opposite of "difficult"?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      mode: QuestionMode.READING,
      difficultyLevel: DifficultyLevel.LEVEL_1,
      options: ['Hard', 'Easy', 'Complex', 'Tough'],
      correctAnswer: 'Easy',
      explanation: 'The antonym of "difficult" is "easy".',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'Which word is a synonym for "happy"?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      mode: QuestionMode.READING,
      difficultyLevel: DifficultyLevel.LEVEL_1,
      options: ['Sad', 'Angry', 'Joyful', 'Tired'],
      correctAnswer: 'Joyful',
      explanation: '"Joyful" is a synonym for "happy".',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'Choose the correct article: "___ university"',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_2,
      options: ['A', 'An', 'The', 'No article'],
      correctAnswer: 'A',
      explanation:
        'We use "a" before words that begin with a consonant sound. "University" begins with a consonant sound /j/.',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'What does "procrastinate" mean?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_3,
      options: ['To do immediately', 'To delay', 'To organize', 'To complete'],
      correctAnswer: 'To delay',
      explanation: 'To procrastinate means to delay or postpone doing something.',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'True or False: Latin is a dead language.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_2,
      correctAnswer: 'false',
      explanation:
        'Latin is considered a classical language, not dead, as it continues to be used in academic, legal, and religious contexts.',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'Translate the following Latin phrase: "Veni, vidi, vici"',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_3,
      correctAnswer: 'I came, I saw, I conquered',
      acceptableAnswers: [
        'I came, I saw, I conquered',
        'I came I saw I conquered',
        'came saw conquered',
        'Tôi đến, tôi thấy, tôi chiến thắng',
      ],
      explanation: 'This famous phrase was reportedly said by Julius Caesar.',
      points: 2,
      category: savedCategories[4], // Translation
    },
    {
      content: 'Write an essay (100-200 words) about the importance of Latin in modern education.',
      type: QuestionType.ESSAY,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_5,
      explanation: 'This is an open-ended question to assess critical thinking and writing skills.',
      points: 10,
      category: savedCategories[2], // Reading Comprehension
    },
    {
      content: 'Listen to the Latin pronunciation and choose the correct word.',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.LISTENING,
      difficulty: DifficultyLevel.LEVEL_2,
      options: ['Caesar', 'Cicero', 'Virgil', 'Ovid'],
      correctAnswer: 'Caesar',
      audioUrl: '/audio/latin-pronunciation-caesar.mp3',
      explanation: 'The audio pronounces "Caesar" in classical Latin.',
      points: 2,
      category: savedCategories[3], // Listening
    },
    {
      content: 'What is the nominative plural of "puella" (girl)?',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_3,
      correctAnswer: 'puellae',
      explanation: 'First declension nouns ending in -a form their nominative plural with -ae.',
      points: 2,
      category: savedCategories[0], // Grammar
    },
    {
      content:
        'Read the passage and answer: What is the main theme?\n\nPassage: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur."',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_4,
      passage:
        'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.',
      options: [
        'The division of Gaul into three parts',
        'The wars of Caesar',
        'The geography of Rome',
        'The culture of the Celts',
      ],
      correctAnswer: 'The division of Gaul into three parts',
      explanation: "This is the famous opening line of Caesar's Commentarii de Bello Gallico.",
      points: 3,
      category: savedCategories[2], // Reading Comprehension
    },

    // Thêm 4 câu hỏi TRUE_FALSE
    {
      content: 'The Latin language is derived from Ancient Greek.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EASY,
      options: ['true', 'false'],
      correctAnswer: 'false',
      explanation: 'Latin is an Italic language that developed independently, though it was influenced by Greek.',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'The Romans used the same alphabet that we use today.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EASY,
      options: ['true', 'false'],
      correctAnswer: 'false',
      explanation: 'The Roman alphabet did not include letters like J, U, and W, which were added later.',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'Latin verbs have a future perfect tense.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      options: ['true', 'false'],
      correctAnswer: 'true',
      explanation: 'Latin has a future perfect tense, e.g., "amavero" (I will have loved).',
      points: 1,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'Most Romance languages evolved from Vulgar Latin.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EASY,
      options: ['true', 'false'],
      correctAnswer: 'true',
      explanation: 'Languages like Spanish, French, Italian, Portuguese, and Romanian all evolved from Vulgar Latin.',
      points: 1,
      category: savedCategories[0], // Grammar
    },

    // Thêm 4 câu hỏi MULTIPLE_CHOICE
    {
      content: 'Which Latin phrase means "seize the day"?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      options: ['In vino veritas', 'Carpe diem', 'Veni, vidi, vici', 'Cogito, ergo sum'],
      correctAnswer: 'Carpe diem',
      explanation: '"Carpe diem" is a phrase from a poem by Horace, encouraging people to enjoy the present day.',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'Which of these is NOT one of the five Latin noun declensions?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.HARD,
      options: ['First', 'Second', 'Third', 'Sixth'],
      correctAnswer: 'Sixth',
      explanation: 'Latin has only five declensions. There is no sixth declension.',
      points: 2,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'What is the meaning of the Latin phrase "et cetera"?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EASY,
      options: ['And so forth', 'In the beginning', 'After death', 'Before noon'],
      correctAnswer: 'And so forth',
      explanation: '"Et cetera" (often abbreviated as "etc.") literally means "and the rest" or "and so forth".',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'Which Latin author wrote "The Aeneid"?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      options: ['Ovid', 'Virgil', 'Cicero', 'Horace'],
      correctAnswer: 'Virgil',
      explanation: 'The Aeneid was written by the Roman poet Virgil between 29 and 19 BC.',
      points: 1,
      category: savedCategories[2], // Reading Comprehension
    },

    // Thêm 4 câu hỏi SHORT_ANSWER
    {
      content: 'Translate the Latin word "aqua" to English.',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EASY,
      correctAnswer: 'water',
      acceptableAnswers: ['water', 'Water', 'WATER'],
      explanation: '"Aqua" is the Latin word for "water", which gives us words like "aquarium" and "aquatic".',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'What is the plural form of "corpus" in Latin?',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      correctAnswer: 'corpora',
      acceptableAnswers: ['corpora', 'Corpora', 'CORPORA'],
      explanation: '"Corpus" is a third declension neuter noun, so its plural form is "corpora".',
      points: 2,
      category: savedCategories[0], // Grammar
    },
    {
      content: 'Complete the famous Latin phrase: "Alea iacta ___"',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      correctAnswer: 'est',
      acceptableAnswers: ['est', 'Est', 'EST'],
      explanation:
        '"Alea iacta est" means "The die is cast" and was reportedly said by Julius Caesar when crossing the Rubicon.',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'What is the Latin root of the English word "magnify"?',
      type: QuestionType.SHORT_ANSWER,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      correctAnswer: 'magnus',
      acceptableAnswers: ['magnus', 'Magnus', 'MAGNUS', 'magn', 'Magn', 'MAGN'],
      explanation: '"Magnify" comes from the Latin word "magnus" meaning "great" or "large".',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },

    // Thêm 4 câu hỏi ESSAY
    {
      content: 'Describe the importance of Latin in scientific terminology and give at least three examples.',
      type: QuestionType.ESSAY,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      explanation: "This question tests understanding of Latin's influence on scientific vocabulary.",
      points: 5,
      category: savedCategories[2], // Reading Comprehension
    },
    {
      content:
        'Compare and contrast the grammatical structures of Latin and English, focusing on sentence structure and noun cases.',
      type: QuestionType.ESSAY,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.HARD,
      explanation: 'This question assesses knowledge of comparative linguistics and grammar.',
      points: 8,
      category: savedCategories[0], // Grammar
    },
    {
      content:
        'Discuss how Latin literature influenced later European literature, with specific examples from at least two different periods.',
      type: QuestionType.ESSAY,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.EXPERT,
      explanation: "This question evaluates understanding of Latin's literary legacy and influence.",
      points: 10,
      category: savedCategories[2], // Reading Comprehension
    },
    {
      content:
        'Explain why Latin continued to be used as a lingua franca in academia, religion, and diplomacy long after it ceased to be a native language.',
      type: QuestionType.ESSAY,
      format: QuestionFormat.TEXT,
      difficulty: DifficultyLevel.MEDIUM,
      explanation: "This question tests historical knowledge of Latin's role as an international language.",
      points: 7,
      category: savedCategories[2], // Reading Comprehension
    },
  ];

  // Fix questions before saving them
  const fixedQuestions = sampleQuestions.map((question) => {
    // Add mode if missing
    if (!question.mode) {
      question.mode = QuestionMode.READING;
    }

    // Convert difficulty to difficultyLevel if needed
    if (question.difficulty && !question.difficultyLevel) {
      question.difficultyLevel = question.difficulty;
      delete question.difficulty;
    }

    return question;
  });

  await questionRepository.save(fixedQuestions);
  console.log('✅ Sample questions seeded successfully');
}

export async function createDefaultQuestionBank(dataSource: DataSource, userId: number) {
  const bankRepository = dataSource.getRepository(QuestionBank);
  const categoryRepository = dataSource.getRepository(QuestionCategory);

  const grammarCategory = await categoryRepository.findOne({ where: { name: 'Grammar' } });

  const defaultBank = bankRepository.create({
    name: 'Latin Basics Question Bank',
    description: 'A comprehensive collection of basic Latin questions for beginners',
    isPublic: true,
    isActive: true,
    creator: { id: userId },
    category: grammarCategory,
  });

  await bankRepository.save(defaultBank);
  console.log('✅ Default question bank created successfully');

  return defaultBank;
}
