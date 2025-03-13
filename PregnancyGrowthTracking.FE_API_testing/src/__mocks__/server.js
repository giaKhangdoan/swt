import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Thiết lập server với các handlers
export const server = setupServer(...handlers); 