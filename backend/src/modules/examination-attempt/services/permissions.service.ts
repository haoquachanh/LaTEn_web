import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExaminationTemplate } from '@entities/examination-template.entity';
import { UserEntity } from '@entities/user.entity';

export interface TemplatePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canUse: boolean; // Can start examination from this template
}

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(ExaminationTemplate)
    private readonly templateRepository: Repository<ExaminationTemplate>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Check if user can use a template to start an examination
   */
  async canUseTemplate(templateId: number, userId: number): Promise<boolean> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['createdBy'],
    });

    if (!template) {
      return false;
    }

    // Template must be active
    if (!template.isActive) {
      return false;
    }

    // Public templates can be used by anyone
    // Private templates can only be used by the creator
    // In future, add allowedUsers/allowedRoles check here

    return true; // For now, all active templates are usable
  }

  /**
   * Check if user can view template details
   */
  async canViewTemplate(templateId: number, userId: number): Promise<boolean> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['createdBy'],
    });

    if (!template) {
      return false;
    }

    // Creator can always view
    if (template.createdBy?.id === userId) {
      return true;
    }

    // Active templates can be viewed by everyone
    if (template.isActive) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can edit a template
   */
  async canEditTemplate(templateId: number, userId: number): Promise<boolean> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['createdBy'],
    });

    if (!template) {
      return false;
    }

    // Only creator can edit (for now)
    // In future, add admin role check
    return template.createdBy?.id === userId;
  }

  /**
   * Check if user can delete a template
   */
  async canDeleteTemplate(templateId: number, userId: number): Promise<boolean> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['createdBy'],
    });

    if (!template) {
      return false;
    }

    // Only creator can delete (for now)
    // In future, add admin role check
    return template.createdBy?.id === userId;
  }

  /**
   * Get all permissions for a template
   */
  async getTemplatePermissions(templateId: number, userId: number): Promise<TemplatePermissions> {
    return {
      canView: await this.canViewTemplate(templateId, userId),
      canEdit: await this.canEditTemplate(templateId, userId),
      canDelete: await this.canDeleteTemplate(templateId, userId),
      canUse: await this.canUseTemplate(templateId, userId),
    };
  }

  /**
   * Assert that user has permission, throw exception if not
   */
  async assertCanUseTemplate(templateId: number, userId: number): Promise<void> {
    const canUse = await this.canUseTemplate(templateId, userId);
    if (!canUse) {
      throw new ForbiddenException('You do not have permission to use this template');
    }
  }

  async assertCanEditTemplate(templateId: number, userId: number): Promise<void> {
    const canEdit = await this.canEditTemplate(templateId, userId);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this template');
    }
  }

  async assertCanDeleteTemplate(templateId: number, userId: number): Promise<void> {
    const canDelete = await this.canDeleteTemplate(templateId, userId);
    if (!canDelete) {
      throw new ForbiddenException('You do not have permission to delete this template');
    }
  }
}
