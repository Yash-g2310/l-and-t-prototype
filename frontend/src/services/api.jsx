const API_URL = 'http://localhost:8000/api';

export const authService = {
  async register(userData) {
    console.log('Registering user:', userData);
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration failed:', data);
        throw {
          message: 'Registration failed',
          errors: data
        };
      }
      
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Similar changes for login
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Login failed:', data);
        throw {
          message: 'Login failed',
          errors: data
        };
      }
      
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      console.log('Login successful, tokens stored');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // function getProfile()
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_URL}/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw {
          message: 'Failed to fetch profile',
          errors: data
        };
      }
      
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
};