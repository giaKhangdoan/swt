import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import foetusService from '../../../api/services/foetusService';
import { ENDPOINTS } from '../../../api/constants/apiEndpoints';

// Mock axios instance
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

const axiosConfig = require('../../../api/config/axiosConfig').default;

const mockUserData = {
  userId: 1,
  username: 'testuser',
  role: 'user'
};

const mockToken = 'mock-token';

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(key => {
        if (key === 'userData') return JSON.stringify(mockUserData);
        if (key === 'token') return mockToken;
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    },
    writable: true
  });
});

describe('foetusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFoetusList', () => {
    it('should fetch foetus list successfully', async () => {
      const mockData = [
        {
          foetusId: 1,
          name: "Bé A",
          gender: "Nam"
        }
      ];

      axiosConfig.get.mockResolvedValueOnce({ data: mockData });

      const result = await foetusService.getFoetusList();
      expect(result).toEqual(mockData);
      expect(axiosConfig.get).toHaveBeenCalledWith(ENDPOINTS.FOETUS.LIST);
    });

    it('should handle error when fetching fails', async () => {
      const errorMessage = 'Server error';
      axiosConfig.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: errorMessage }
        }
      });

      try {
        await foetusService.getFoetusList();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(500);
      }
    });
  });

  describe('createFoetus', () => {
    it('should create foetus successfully', async () => {
      const newFoetus = {
        name: "Bé B",
        gender: "Nam"
      };

      const expectedPayload = {
        name: newFoetus.name,
        gender: newFoetus.gender,
        userId: mockUserData.userId
      };

      const mockResponse = {
        data: {
          foetusId: 1,
          ...newFoetus
        }
      };

      axiosConfig.post.mockResolvedValueOnce(mockResponse);

      const result = await foetusService.createFoetus(newFoetus);
      expect(result).toEqual(mockResponse.data);
      expect(axiosConfig.post).toHaveBeenCalledWith(
        ENDPOINTS.FOETUS.LIST,
        expectedPayload
      );
    });

    it('should handle error when creating fails', async () => {
      const newFoetus = {
        name: "Bé B",
        gender: "Nam"
      };

      const errorMessage = 'Server error';
      axiosConfig.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: errorMessage }
        }
      });

      try {
        await foetusService.createFoetus(newFoetus);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(500);
      }
    });
  });
}); 