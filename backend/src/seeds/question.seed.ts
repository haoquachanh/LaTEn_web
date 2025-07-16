import { DataSource } from 'typeorm';
import { QuestionCategory } from '../entities/question-category.entity';
import { QuestionBank } from '../entities/question-bank.entity';
import { Question, QuestionType, QuestionFormat, DifficultyLevel } from '../entities/question.entity';

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
    }
  ];

  const savedCategories = await categoryRepository.save(categories);
  console.log('✅ Categories seeded successfully');

  // Sample Questions for different types and difficulties
  const sampleQuestions = [
    {
      content: 'What is the meaning of "amor" in Latin?',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_1,
      options: ['Love', 'War', 'Peace', 'Wisdom'],
      correctAnswer: 'Love',
      explanation: '"Amor" is the Latin word for love.',
      points: 1,
      category: savedCategories[1], // Vocabulary
    },
    {
      content: 'True or False: Latin is a dead language.',
      type: QuestionType.TRUE_FALSE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_2,
      correctAnswer: 'false',
      explanation: 'Latin is considered a classical language, not dead, as it continues to be used in academic, legal, and religious contexts.',
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
        'Tôi đến, tôi thấy, tôi chiến thắng'
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
      content: 'Read the passage and answer: What is the main theme?\n\nPassage: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur."',
      type: QuestionType.MULTIPLE_CHOICE,
      format: QuestionFormat.READING,
      difficulty: DifficultyLevel.LEVEL_4,
      passage: 'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.',
      options: [
        'The division of Gaul into three parts',
        'The wars of Caesar',
        'The geography of Rome',
        'The culture of the Celts'
      ],
      correctAnswer: 'The division of Gaul into three parts',
      explanation: 'This is the famous opening line of Caesar\'s Commentarii de Bello Gallico.',
      points: 3,
      category: savedCategories[2], // Reading Comprehension
    }
  ];

  await questionRepository.save(sampleQuestions);
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
