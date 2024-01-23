import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Cell from "@/components/Board/Cell";

describe('Cell', () => {

	it('should not show any digit if its 0', () => {
		render (
      <Cell
				cellIndex={3}
				digit={0}
				highlight=''
				selectCell={() => {}}
        notes={[]}
        errorCell={undefined}
      />
    );
    for (let i = 1; i < 10; i++) {
			expect(screen.queryByText(i)).toBeNull();
		}
	})

  it('should show given digit', () => {
    render (
      <Cell
				cellIndex={2}
				digit={8}
				highlight=''
				selectCell={() => {}}
        notes={[]}
        errorCell={undefined}
      />
    );
    expect(screen.getByText('8')).toBeDefined();
    
    const shouldNotShow = [
      screen.queryByText('2'),
      screen.queryByText('5'),
      screen.queryByText('9')
    ];
    for(let notShown of shouldNotShow){
      expect(notShown).toBeNull();
    }
  })

  it('should display all notes', () => {
    render (
			<Cell
				cellIndex={2}
				digit={0}
				highlight=''
				selectCell={() => {}}
        notes={[1,2,3,4,5,6,7,8,9]}
        errorCell={undefined}
      />
    );
    for(let i = 1; i < 10; i++){
      expect(screen.getByText(i)).toBeDefined();
    }
  })

	it('should not display notes if it has a digit', () => {
    render (
			<Cell
				cellIndex={2}
				digit={9}
				highlight=''
				selectCell={() => {}}
        notes={[1,2,3,4,5,6,7,8]}
        errorCell={undefined}
      />
    );
		expect(screen.getByText(9)).toBeDefined()

    for(let i = 1; i < 9; i++){
      expect(screen.queryByText(i)).toBeNull();
    }
  })
})