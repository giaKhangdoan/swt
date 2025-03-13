import axiosInstance from '../../../api/config/axiosConfig';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/constants/apiEndpoints';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    }))
  };
});

describe('axiosConfig', () => {
  it('should create axios instance with correct baseURL', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: API_BASE_URL
      })
    );
  });

  it('should have request and response interceptors', () => {
    expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(axiosInstance.interceptors.response.use).toHaveBeenCalled();
  });
}); 