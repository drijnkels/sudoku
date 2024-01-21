import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Controls from "@/components/Controls/Controls";

const mockSetDigit = vi.fn();
const mockUndoLastMove = vi.fn();
const mockEmptyCell = vi.fn();
const mockHandleToggleNotesActive = vi.fn();

describe('Controls', () => {

  it('should render all buttons', () => {
    let notesActive = false;
    render (
      <Controls setDigit={mockSetDigit} undoLastMove={mockUndoLastMove} emptyCell={mockEmptyCell} handleToggleNotesActive={mockHandleToggleNotesActive} notesActive={notesActive} />
    );
    for (let i = 1; i < 10; i++) {
      expect(screen.getByText(i)).toBeDefined();
    }

    expect(screen.getByText('Notes')).toBeDefined()
    expect(screen.getByText('Undo')).toBeDefined()
    expect(screen.getByText('Empty')).toBeDefined()
  });

  it('should toggle notes', async () => {
    let notesActive = false;
    render (
      <Controls setDigit={mockSetDigit} undoLastMove={mockUndoLastMove} emptyCell={mockEmptyCell} handleToggleNotesActive={mockHandleToggleNotesActive} notesActive={notesActive} />
    );

    const button = screen.getByText('Notes');

    await userEvent.click(button);

    expect(mockHandleToggleNotesActive).toHaveBeenCalled();
  });

  it('should undo last move', async () => {
    let notesActive = false;
    render (
      <Controls setDigit={mockSetDigit} undoLastMove={mockUndoLastMove} emptyCell={mockEmptyCell} handleToggleNotesActive={mockHandleToggleNotesActive} notesActive={notesActive} />
    );

    const button = screen.getByText('Undo');

    await userEvent.click(button);

    expect(mockUndoLastMove).toHaveBeenCalled();
  });

  it('should empty cell', async () => {
    let notesActive = false;
    render (
      <Controls setDigit={mockSetDigit} undoLastMove={mockUndoLastMove} emptyCell={mockEmptyCell} handleToggleNotesActive={mockHandleToggleNotesActive} notesActive={notesActive} />
    );

    const button = screen.getByText('Empty');

    await userEvent.click(button);

    expect(mockEmptyCell).toHaveBeenCalled();
  });

})