import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Use 12 rounds for production-grade security
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  
  await prisma.admin.upsert({
    where: { email: 'ibrahimkamil362@gmail.com' },
    update: {
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: 'ibrahimkamil362@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
    }
  });
  
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📝 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:   ibrahimkamil362@gmail.com / Admin@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('⚠️  IMPORTANT: Change these passwords in production!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
