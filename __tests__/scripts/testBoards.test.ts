import { describe, it, expect } from 'vitest';

import { easyBoards, mediumBoards, hardBoards, evilBoards } from '@/lib/boards/boards';
import { stringToBoard, validateBoard } from "@/scripts/utils";

describe('validateSolutions', () => {
  it('all easy solutions should be valid board', () => {
    for(let board of easyBoards) {
      const boardData = stringToBoard(board.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all medium solutions should be valid board', () => {
    for(let board of mediumBoards) {
      const boardData = stringToBoard(board.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all hard solutions should be valid board', () => {
    for(let board of hardBoards) {
      const boardData = stringToBoard(board.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all evil solutions should be valid board', () => {
    for(let board of easyBoards) {
      const boardData = stringToBoard(board.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });
})