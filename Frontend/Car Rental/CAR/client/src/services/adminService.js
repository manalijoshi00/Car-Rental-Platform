// Admin service to fetch data from Spring Boot backend
const SPRING_BOOT_API_BASE = 'http://localhost:8080/api/admins';

export const adminService = {
  // Login admin and get admin data
  async loginAdmin(credentials) {
    try {
      const response = await fetch(`${SPRING_BOOT_API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Admin login failed');
      }

      const adminData = await response.json();
      return adminData;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Get admin profile by ID
  async getAdminProfile(adminId) {
    try {
      const response = await fetch(`${SPRING_BOOT_API_BASE}/${adminId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin profile');
      }

      const adminData = await response.json();
      return adminData;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      const response = await fetch(`${SPRING_BOOT_API_BASE}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const admins = await response.json();
      return admins;
    } catch (error) {
      console.error('Get all admins error:', error);
      throw error;
    }
  }
};
