import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import reminderService from '../../../api/services/reminderService';
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

describe('reminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReminderHistory', () => {
    it('should fetch reminders successfully', async () => {
      const mockData = [
        {
          remindId: 1,
          title: "Uống thuốc",
          date: "2024-03-15",
          time: "08:00"
        }
      ];

      axiosConfig.get.mockResolvedValueOnce({ data: mockData });

      const result = await reminderService.getReminderHistory();
      expect(result).toEqual(mockData);
      expect(axiosConfig.get).toHaveBeenCalledWith(ENDPOINTS.REMINDER.LIST);
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
        await reminderService.getReminderHistory();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(500);
      }
    });
  });

  describe('createReminder', () => {
    it('should create reminder successfully', async () => {
      const newReminder = {
        title: "Uống thuốc",
        date: "2024-03-15",
        time: "08:00",
        reminderType: "MEDICINE"
      };

      const expectedPayload = {
        userId: mockUserData.userId,
        title: newReminder.title,
        date: newReminder.date,
        time: newReminder.time,
        notification: "",
        reminderType: newReminder.reminderType,
        isCompleted: false,
        isDeleted: false
      };

      axiosConfig.post.mockResolvedValueOnce({ data: newReminder });

      const result = await reminderService.createReminder(newReminder);
      expect(result).toEqual(newReminder);
      expect(axiosConfig.post).toHaveBeenCalledWith(
        ENDPOINTS.REMINDER.CREATE,
        expectedPayload,
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  describe('deleteReminder', () => {
    it('should delete reminder successfully', async () => {
      const remindId = 1;
      const mockResponse = { success: true };
      
      axiosConfig.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await reminderService.deleteReminder(remindId);
      expect(result).toEqual(mockResponse);
      expect(axiosConfig.delete).toHaveBeenCalledWith(
        ENDPOINTS.REMINDER.DELETE(remindId)
      );
    });

    it('should throw error when remindId is invalid', async () => {
      const remindId = null;
      
      try {
        await reminderService.deleteReminder(remindId);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('ID lịch nhắc nhở không hợp lệ');
      }
    });

    it('should handle error when deleting fails', async () => {
      const remindId = 1;
      const errorMessage = 'Server error';
      
      axiosConfig.delete.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: errorMessage }
        }
      });

      try {
        await reminderService.deleteReminder(remindId);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(500);
      }
    });
  });
}); 