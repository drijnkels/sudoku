import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Button from "@/components/Controls/DigitButton";

describe('Button', () => {

	it('should shown childern', () => {
		render (
      <Button>8</Button>
    );
    expect(screen.getByText(8)).toBeDefined();
	})

  it('should show given digit', async () => {
		const mockOnClick = vi.fn();
    render (
      <Button onClick={mockOnClick}>Test</Button>
    );

		const button = screen.getByText('Test');
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  })

})