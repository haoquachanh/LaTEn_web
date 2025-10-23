import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QandAQuestion, QuestionCategory } from '../entities/qanda-question.entity';
import { QandAAnswer } from '../entities/qanda-answer.entity';
import { UserEntity } from '../entities/user.entity';
import { PostTag } from '../entities/post-tag.entity';
import { UserRole } from '../common/typings/user-role.enum';

@Injectable()
export class QandASeed {
  constructor(
    @InjectRepository(QandAQuestion)
    private questionRepository: Repository<QandAQuestion>,
    @InjectRepository(QandAAnswer)
    private answerRepository: Repository<QandAAnswer>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostTag)
    private tagRepository: Repository<PostTag>,
  ) {}

  async run() {
    console.log('🌱 Seeding Q&A data...');

    // Get or create admin user
    let admin = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      admin = await this.userRepository.findOne({ where: { role: UserRole.ADMIN } });
    }
    if (!admin) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    // Get or create tags
    const tagNames = ['English', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'TOEIC', 'IELTS'];
    const tags: PostTag[] = [];

    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = this.tagRepository.create({ name: tagName, description: `${tagName} related questions` });
        await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }

    // Sample questions
    const sampleQuestions = [
      {
        title: 'How to improve English speaking skills?',
        content:
          'I have been learning English for 2 years but still struggle with speaking fluently. What are some effective methods to practice speaking?',
        category: QuestionCategory.LEARNING,
        tags: [tags[0], tags[3]], // English, Speaking
        answers: [
          {
            content:
              'Try practicing with native speakers through language exchange apps like HelloTalk or Tandem. Daily conversation practice is key!',
            isAccepted: true,
          },
          {
            content:
              'Watch English movies and TV shows without subtitles, then try to shadow the actors. This helps with pronunciation and natural speech patterns.',
            isAccepted: false,
          },
        ],
      },
      {
        title: 'What is the difference between Present Perfect and Past Simple?',
        content:
          'I always get confused when to use Present Perfect (have done) vs Past Simple (did). Can someone explain with examples?',
        category: QuestionCategory.GENERAL,
        tags: [tags[0], tags[1]], // English, Grammar
        answers: [
          {
            content:
              'Present Perfect connects past to present (I have lived here for 5 years - still living). Past Simple is completed action (I lived there in 2020 - finished).',
            isAccepted: true,
          },
        ],
      },
      {
        title: 'Best resources for TOEIC preparation?',
        content: 'I need to get 800+ on TOEIC test. What are the best books, apps, or websites for preparation?',
        category: QuestionCategory.EXAM,
        tags: [tags[0], tags[6]], // English, TOEIC
        answers: [
          {
            content: 'ETS official TOEIC books are the best. Also try the TOEIC Test Pro app for daily practice.',
            isAccepted: false,
          },
          {
            content:
              "I recommend: 1) Barron's TOEIC book 2) Hackers TOEIC series 3) Practice tests on toeic.vn. Focus on time management!",
            isAccepted: true,
          },
        ],
      },
      {
        title: 'How to expand vocabulary effectively?',
        content: 'I keep forgetting new words after learning them. What techniques help with long-term retention?',
        category: QuestionCategory.LEARNING,
        tags: [tags[0], tags[2]], // English, Vocabulary
        answers: [
          {
            content:
              'Use spaced repetition apps like Anki. Review words at increasing intervals: 1 day, 3 days, 1 week, 1 month.',
            isAccepted: true,
          },
        ],
      },
      {
        title: 'Common mistakes in English writing?',
        content:
          'What are the most common grammar and style mistakes that non-native English speakers make in writing?',
        category: QuestionCategory.TECHNICAL,
        tags: [tags[0], tags[1], tags[5]], // English, Grammar, Writing
        answers: [],
      },
      {
        title: 'Tips for IELTS Writing Task 2?',
        content: 'How can I improve my IELTS Writing Task 2 score from 6.0 to 7.0+? What should I focus on?',
        category: QuestionCategory.EXAM,
        tags: [tags[0], tags[7], tags[5]], // English, IELTS, Writing
        answers: [
          {
            content:
              'Focus on: 1) Clear thesis statement 2) Well-developed paragraphs with examples 3) Cohesive devices 4) Academic vocabulary 5) Error-free grammar',
            isAccepted: false,
          },
        ],
      },
      {
        title: 'How to train listening skills for fast English?',
        content:
          'I can understand slow English but struggle with native speed. How to improve comprehension at natural pace?',
        category: QuestionCategory.LEARNING,
        tags: [tags[0], tags[4]], // English, Listening
        answers: [],
      },
      {
        title: 'What are phrasal verbs and how to learn them?',
        content: 'Phrasal verbs are confusing! Is there a systematic way to learn and remember them?',
        category: QuestionCategory.GENERAL,
        tags: [tags[0], tags[1], tags[2]], // English, Grammar, Vocabulary
        answers: [
          {
            content:
              "Learn phrasal verbs by category (movement: get up, sit down; communication: speak up, shut down). Use them in context, don't memorize lists!",
            isAccepted: true,
          },
        ],
      },
    ];

    // Create questions and answers
    for (const questionData of sampleQuestions) {
      // Check if question already exists
      const existing = await this.questionRepository.findOne({
        where: { title: questionData.title },
      });

      if (existing) {
        console.log(`⏭️  Question already exists: ${questionData.title}`);
        continue;
      }

      const question = this.questionRepository.create({
        title: questionData.title,
        content: questionData.content,
        category: questionData.category,
        userId: admin.id,
        author: admin,
        isActive: true,
        isAnswered: questionData.answers.length > 0,
        tags: questionData.tags,
      });

      await this.questionRepository.save(question);
      console.log(`✅ Created question: ${question.title}`);

      // Create answers
      for (const answerData of questionData.answers) {
        const answer = this.answerRepository.create({
          content: answerData.content,
          isAccepted: answerData.isAccepted,
          questionId: question.id,
          userId: admin.id,
          author: admin,
          isActive: true,
        });

        await this.answerRepository.save(answer);

        if (answerData.isAccepted) {
          question.acceptedAnswerId = answer.id;
          await this.questionRepository.save(question);
        }

        console.log(`   ✅ Created answer for question ${question.id}`);
      }
    }

    console.log('✅ Q&A seed completed!');
  }
}
