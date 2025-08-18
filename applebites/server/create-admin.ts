import { storage } from "./storage";
import bcrypt from 'bcryptjs';

async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getTeamMemberByEmail('admin@applebites.com');
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 12);
    
    const admin = await storage.createTeamMember({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@applebites.com',
      role: 'admin',
      hashedPassword,
      isActive: true,
    } as any);

    console.log('Default admin created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

createDefaultAdmin();