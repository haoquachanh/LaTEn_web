import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateQandATables1740000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create qanda_questions table
    await queryRunner.createTable(
      new Table({
        name: 'qanda_questions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['general', 'technical', 'learning', 'exam', 'other'],
            default: "'general'",
          },
          {
            name: 'likes',
            type: 'int',
            default: 0,
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
          },
          {
            name: 'isAnswered',
            type: 'boolean',
            default: false,
          },
          {
            name: 'acceptedAnswerId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create qanda_answers table
    await queryRunner.createTable(
      new Table({
        name: 'qanda_answers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'isAccepted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'likes',
            type: 'int',
            default: 0,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'questionId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create qanda_question_likes table
    await queryRunner.createTable(
      new Table({
        name: 'qanda_question_likes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'questionId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create qanda_answer_likes table
    await queryRunner.createTable(
      new Table({
        name: 'qanda_answer_likes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'answerId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create qanda_question_tags_relation table
    await queryRunner.createTable(
      new Table({
        name: 'qanda_question_tags_relation',
        columns: [
          {
            name: 'questionId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'tagId',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    // Add foreign keys for qanda_questions
    await queryRunner.createForeignKey(
      'qanda_questions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign keys for qanda_answers
    await queryRunner.createForeignKey(
      'qanda_answers',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'qanda_questions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'qanda_answers',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign keys for qanda_question_likes
    await queryRunner.createForeignKey(
      'qanda_question_likes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'qanda_question_likes',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'qanda_questions',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign keys for qanda_answer_likes
    await queryRunner.createForeignKey(
      'qanda_answer_likes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'qanda_answer_likes',
      new TableForeignKey({
        columnNames: ['answerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'qanda_answers',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign keys for qanda_question_tags_relation
    await queryRunner.createForeignKey(
      'qanda_question_tags_relation',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'qanda_questions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'qanda_question_tags_relation',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_tags',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes
    await queryRunner.query(`CREATE INDEX IDX_qanda_questions_userId ON qanda_questions(userId)`);
    await queryRunner.query(`CREATE INDEX IDX_qanda_questions_category ON qanda_questions(category)`);
    await queryRunner.query(`CREATE INDEX IDX_qanda_questions_isAnswered ON qanda_questions(isAnswered)`);
    await queryRunner.query(`CREATE INDEX IDX_qanda_questions_createdAt ON qanda_questions(createdAt)`);
    await queryRunner.query(`CREATE INDEX IDX_qanda_answers_questionId ON qanda_answers(questionId)`);
    await queryRunner.query(`CREATE INDEX IDX_qanda_answers_userId ON qanda_answers(userId)`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IDX_qanda_question_likes_userId_questionId ON qanda_question_likes(userId, questionId)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IDX_qanda_answer_likes_userId_answerId ON qanda_answer_likes(userId, answerId)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IDX_qanda_answer_likes_userId_answerId ON qanda_answer_likes`);
    await queryRunner.query(`DROP INDEX IDX_qanda_question_likes_userId_questionId ON qanda_question_likes`);
    await queryRunner.query(`DROP INDEX IDX_qanda_answers_userId ON qanda_answers`);
    await queryRunner.query(`DROP INDEX IDX_qanda_answers_questionId ON qanda_answers`);
    await queryRunner.query(`DROP INDEX IDX_qanda_questions_createdAt ON qanda_questions`);
    await queryRunner.query(`DROP INDEX IDX_qanda_questions_isAnswered ON qanda_questions`);
    await queryRunner.query(`DROP INDEX IDX_qanda_questions_category ON qanda_questions`);
    await queryRunner.query(`DROP INDEX IDX_qanda_questions_userId ON qanda_questions`);

    // Drop tables (order matters due to foreign keys)
    await queryRunner.dropTable('qanda_question_tags_relation');
    await queryRunner.dropTable('qanda_answer_likes');
    await queryRunner.dropTable('qanda_question_likes');
    await queryRunner.dropTable('qanda_answers');
    await queryRunner.dropTable('qanda_questions');
  }
}
