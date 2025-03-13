import '@testing-library/jest-dom';

// Tạm comment phần MSW
// import { server } from './__mocks__/server';
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Thêm mock cho matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock cho VIP user
const mockVipUser = {
  username: "vip2",
  password: "vip123",
  roleId: "Vip",
  token: "fake-vip-token"
};

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(key => {
    if (key === 'token') return mockVipUser.token;
    if (key === 'user') return JSON.stringify(mockVipUser);
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock window.location
delete window.location;
window.location = {
  href: '',
  assign: jest.fn(),
  reload: jest.fn()
};

// Tắt console logs trong tests
console.error = jest.fn();
console.log = jest.fn();
console.warn = jest.fn();

// Set timeout dài hơn cho tests
jest.setTimeout(10000); 