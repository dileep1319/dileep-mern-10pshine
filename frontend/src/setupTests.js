import { TextEncoder, TextDecoder } from 'util';

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';

// Mock scrollTo (jsdom doesn't support it)
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

// Mock localStorage so tests can spy on it
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// Silence console.error logs during test runs
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Login failed|Signup failed/i.test(args[0])) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

beforeAll(() => {
  console.error = (...args) => {
    if (/Login failed|Signup failed|Error (creating|updating|deleting) note/i.test(args[0])) return;
    originalError(...args);
  };
});