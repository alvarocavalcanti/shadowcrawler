import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Main from './Main';

// Mock OBR SDK
vi.mock('@owlbear-rodeo/sdk', () => ({
  default: {
    broadcast: {
      sendMessage: vi.fn(),
      onMessage: vi.fn(),
    },
    scene: {
      isReady: vi.fn().mockResolvedValue(true),
    }
  },
}));

describe('Main (Shadow Crawler)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders correctly for GM', () => {
    render(<Main player={false} />);
    expect(screen.getByText('Torch Timer')).toBeInTheDocument();
    expect(screen.getByText('Crawling Turns Counter')).toBeInTheDocument();
  });

  it('increments crawling turns counter', () => {
    render(<Main player={false} />);
    
    // Find the + button for crawling turns.
    // There are multiple "+" buttons, one for torch turns and one for crawling turns.
    // We need to find the correct one.
    const plusButtons = screen.getAllByText('+');
    // Assuming the second one is for crawling turns, wait, mode defaults to oneHour, so Torch Turn buttons are hidden!
    // So there is only ONE + button visible initially.
    fireEvent.click(plusButtons[0]);
    
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('changes mode to 10 Turns and increments torch turn', () => {
    render(<Main player={false} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10-turns' } });
    
    // Now Torch Turns "+" button appears
    const plusButtons = screen.getAllByText('+');
    expect(plusButtons.length).toBe(2);
    
    // Click the Torch Turn +
    fireEvent.click(plusButtons[0]);
    // It should now show "01" (for torch) and "00" (for crawling)
    const displays = screen.getAllByText('01');
    expect(displays.length).toBeGreaterThan(0);
  });
});
