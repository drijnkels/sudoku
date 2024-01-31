import { describe, it, expect } from 'vitest';

import { easySolutions, mediumSolutions, hardSolutions, evilSolutions } from '@/components/boards/solutions';
import { stringToBoard, validateBoard } from "@/scripts/utils";

describe('validateSolutions', () => {
  it('all easy solutions should be valid board', () => {
    for(let solution of easySolutions) {
      const boardData = stringToBoard(solution.board);
      console.log(solution.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all medium solutions should be valid board', () => {
    for(let solution of mediumSolutions) {
      const boardData = stringToBoard(solution.board);
      console.log(solution.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all hard solutions should be valid board', () => {
    for(let solution of hardSolutions) {
      const boardData = stringToBoard(solution.board);
      console.log(solution.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all evil solutions should be valid board', () => {
    for(let solution of evilSolutions) {
      const boardData = stringToBoard(solution.board);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });
})