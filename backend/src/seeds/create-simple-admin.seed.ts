import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../common/typings/user-role.enum';
import * as bcrypt from 'bcrypt';

/**
 * Create simple admin account with username/password: admin/admin
 */
export async function createSimpleAdmin(dataSource: DataSource): Promise<UserEntity> {
  const userRepository = dataSource.getRepository(UserEntity);

  try {
    // Check if admin user exists by email
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@laten.com' },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('📧 Email: admin@laten.com');
      console.log('🔑 Password: admin');
      return existingAdmin;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // Create admin user
    const adminUser = userRepository.create({
      email: 'admin@laten.com',
      password: hashedPassword,
      fullname: 'Admin User',
      role: UserRole.ADMIN,
      phone: '0000000000',
      birth: '1990-01-01',
    });

    // Save to database
    const savedAdmin = await userRepository.save(adminUser);

    // Success feedback
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@laten.com');
    console.log('🔑 Password: admin');
    console.log('⚠️  For production, please change the password immediately!');

    return savedAdmin;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
}
