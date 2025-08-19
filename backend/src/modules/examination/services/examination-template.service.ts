import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ExaminationTemplate } from '@entities/examination-template.entity';

@Injectable()
export class ExaminationTemplateService {
  constructor(
    @InjectRepository(ExaminationTemplate)
    private readonly templateRepository: Repository<ExaminationTemplate>,
  ) {}

  async findAll(options: { page?: number; limit?: number; isActive?: boolean } = {}) {
    const { page = 1, limit = 10, isActive } = options;

    const whereCondition: any = {};

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    const [templates, total] = await this.templateRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
    });

    return {
      items: templates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!template) {
      throw new NotFoundException(`Examination template with ID ${id} not found`);
    }

    return template;
  }

  async search(query: string, options: { page?: number; limit?: number; isActive?: boolean } = {}) {
    const { page = 1, limit = 10, isActive } = options;

    const whereCondition: any = {};

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    if (query) {
      whereCondition.title = Like(`%${query}%`);
    }

    const [templates, total] = await this.templateRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
    });

    return {
      items: templates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
