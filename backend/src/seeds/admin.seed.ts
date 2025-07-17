import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../common/typings/user-role.enum';
import * as bcrypt from 'bcrypt';

/**
 * Professional Admin User Creation Service
 *
 * Features:
 * - Environment-driven configuration
 * - Duplicate prevention
 * - Secure password hashing (bcrypt)
 * - Production-ready error handling
 *
 * Usage: npm run seed:admin
 */

export async function createAdminUser(dataSource: DataSource): Promise<UserEntity> {
  const userRepository = dataSource.getRepository(UserEntity);

  try {
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Get configuration from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      throw new Error('Invalid admin email format');
    }

    // Validate password strength
    if (adminPassword.length < 8) {
      throw new Error('Admin password must be at least 8 characters long');
    }

    // Hash password securely with bcrypt (12 rounds for high security)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const adminUser = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      fullname: 'System Administrator',
      role: UserRole.ADMIN,
      phone: '0000000000',
    });

    // Save to database
    const savedAdmin = await userRepository.save(adminUser);

    // Success feedback
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Temporary Password:', adminPassword);
    console.log('⚠️  IMPORTANT: Change password after first login!');
    console.log('🔒 Password is securely hashed with bcrypt (12 rounds)');

    return savedAdmin;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
}

/**
 * Utility function to generate secure password hash
 * Can be used for password updates or manual admin creation
 */
export async function generatePasswordHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}
