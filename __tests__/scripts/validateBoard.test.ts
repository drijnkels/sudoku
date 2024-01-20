import { describe, it, expect } from 'vitest';

import { mockEasyBoard } from '../mocks/mockSudokus';
import { stringToBoard, validateBoard } from "@/scripts/utils";

describe('validateBoard', () => {
  it('should return true for a valid board', () => {
    const boardData = stringToBoard(mockEasyBoard);
    /* @ts-ignore */
    expect(validateBoard(boardData)).toBe(true);
  });

  it('should return false for an invalid board', () => {
    const boardData = stringToBoard(mockEasyBoard);
    /* @ts-ignore */
    expect(validateBoard(boardData)).toBe(false);
  });
})