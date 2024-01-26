import { describe, it, expect } from 'vitest';

import { easySolutions, mediumSolutions, evilSolutions } from '@/components/boards/solutions';
import { stringToBoard, validateBoard } from "@/scripts/utils";

describe('validateSolutions', () => {
  it('all easy solutions should be valid board', () => {
    for(let solution of easySolutions) {
      const boardData = stringToBoard(solution.solution);
      console.log(solution.solution);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it('all medium solutions should be valid board', () => {
    for(let solution of mediumSolutions) {
      const boardData = stringToBoard(solution.solution);
      console.log(solution.solution);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });

  it.todo('all hard solutions should be valid board', () => {

  });

  it('all evil solutions should be valid board', () => {
    for(let solution of evilSolutions) {
      const boardData = stringToBoard(solution.solution);
      /* @ts-ignore */
      expect(validateBoard(boardData)).toBe(true);
    }
  });
})