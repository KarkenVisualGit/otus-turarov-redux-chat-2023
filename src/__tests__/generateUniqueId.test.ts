import { generateUniqueId } from '../chat';

describe('generateUniqueId', () => {
  it('should return a unique ID in the correct format', () => {
    const uniqueId = generateUniqueId();
    const parts = uniqueId.split('-');

    expect(parts.length).toBe(2);

    const timestamp = parseInt(parts[0]);
    expect(!isNaN(timestamp)).toBe(true);

    const randomPart = parts[1];
    expect(typeof randomPart).toBe('string');
  });

  it('should return a different ID on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, generateUniqueId));
    
    expect(ids.size).toBe(100);
  });
});
