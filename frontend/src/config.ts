/**
 * Centralized Configuration for the Application
 */

const CONFIG = {
  // Base URL for the Backend API
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4002',
  
  // Timeout for API requests (ms)
  TIMEOUT: 10000,
};

// Define API Endpoints
export const API_URLS = {
  base: CONFIG.API_BASE_URL,
  login: `${CONFIG.API_BASE_URL}/api/login`,
  items: (page: number, limit: number) => `${CONFIG.API_BASE_URL}/api/items?page=${page}&limit=${limit}`,
  activeYears: `${CONFIG.API_BASE_URL}/api/years/active`,
  studentFees: (id: number | string) => `${CONFIG.API_BASE_URL}/api/fees/${id}`,
  studentExams: (id: number | string) => `${CONFIG.API_BASE_URL}/api/exams/${id}`,
};

export default CONFIG;
