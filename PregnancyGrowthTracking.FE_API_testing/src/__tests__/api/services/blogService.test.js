import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import blogService from '../../../api/services/blogService';
import { ENDPOINTS } from '../../../api/constants/apiEndpoints';

// Mock axiosConfig với một object đơn giản
jest.mock('../../../api/config/axiosConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }
}));

// Import axiosConfig đã mock
const axiosConfig = require('../../../api/config/axiosConfig').default;

describe('blogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => {
          if (key === 'token') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aXAyQGV4YW1wbGUuY29tIiwibmFtZSI6InZpcDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJ2aXAiLCJVc2VySWQiOiIzIiwiZXhwIjoxNzQxODgwOTA1LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTUwIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE1MCJ9.EUHOcBTNDoWiTnnuXr2rlfFLL17yUFvUYbEwrk5j5Qs';
          if (key === 'user') return JSON.stringify({
            username: 'vip2',
            password: 'vip123',
            roleId: 'Vip'
          });
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  describe('getBlogs', () => {
    it('should fetch blogs successfully with VIP user', async () => {
      const mockBlogs = [
        {
          id: 1,
          title: "Dinh dưỡng cho mẹ bầu",
          content: "Các thực phẩm tốt cho mẹ bầu...",
          createdAt: "2024-03-15T08:00:00",
          author: "Admin"
        },
        {
          id: 2,
          title: "Lịch khám thai định kỳ",
          content: "Hướng dẫn lịch khám thai...",
          createdAt: "2024-03-15T09:00:00",
          author: "Admin"
        }
      ];

      // Mock response thành công
      axiosConfig.get.mockResolvedValueOnce({ data: mockBlogs });

      const result = await blogService.getBlogs();
      
      expect(result).toEqual(mockBlogs);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('token');
      expect(axiosConfig.get).toHaveBeenCalledWith(ENDPOINTS.BLOG.LIST, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aXAyQGV4YW1wbGUuY29tIiwibmFtZSI6InZpcDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJ2aXAiLCJVc2VySWQiOiIzIiwiZXhwIjoxNzQxODgwOTA1LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTUwIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE1MCJ9.EUHOcBTNDoWiTnnuXr2rlfFLL17yUFvUYbEwrk5j5Qs'
        }
      });
    });

    it('should handle unauthorized access', async () => {
      // Mock response lỗi 401
      axiosConfig.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Unauthorized access' }
        }
      });

      try {
        await blogService.getBlogs();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.data.message).toBe('Unauthorized access');
      }
    });

    it('should handle server error', async () => {
      // Mock response lỗi 500
      axiosConfig.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      });

      try {
        await blogService.getBlogs();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(500);
      }
    });

    it('should handle network error', async () => {
      // Mock network error
      axiosConfig.get.mockRejectedValueOnce(new Error('Network Error'));

      try {
        await blogService.getBlogs();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Network Error');
      }
    });
  });
}); 