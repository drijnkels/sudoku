import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Notes from "@/components/Board/Notes";

describe('Notes', () => {

  it('should show only given digits', () => {
    render (
      <Notes
        notes={[1,3]}
      />
    );
    expect(screen.getByText('1')).toBeDefined();

    const shouldNotShow = [
      screen.queryByText('2'),
      screen.queryByText('5'),
      screen.queryByText('9')
    ];
    for(let notShown of shouldNotShow){
      expect(notShown).toBeNull();
    }
  })

  it('should display all digits', () => {
    render (
      <Notes
        notes={[1,2,3,4,5,6,7,8,9]}
      />
    );
    for(let i = 1; i < 10; i++){
      expect(screen.getByText(i)).toBeDefined();
    }
  })
})