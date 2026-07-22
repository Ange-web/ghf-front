import { render, screen, act } from '@testing-library/react';
import CountdownTimer from '@/components/CountdownTimer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('affiche le compte à rebours correct pour une date future', () => {
    const now = new Date('2026-07-22T12:00:00.000Z');
    jest.setSystemTime(now);

    // +2j 3h 4min 5s
    const offsetMs =
      2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 4 * 60 * 1000 + 5 * 1000;
    const target = new Date(now.getTime() + offsetMs);

    render(<CountdownTimer targetDate={target.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    const timer = screen.getByTestId('countdown-timer');
    expect(timer).toHaveTextContent('02');
    expect(timer).toHaveTextContent('03');
    expect(timer).toHaveTextContent('04');
    expect(timer).toHaveTextContent('05');
  });

  it('affiche 00 partout quand la date cible est déjà passée', () => {
    jest.setSystemTime(new Date('2026-07-22T12:00:00.000Z'));

    render(<CountdownTimer targetDate="2020-01-01T00:00:00.000Z" />);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    const values = screen
      .getAllByText('00')
      .map((el) => el.textContent);
    expect(values).toHaveLength(4);
  });

  it('met à jour l’affichage chaque seconde', () => {
    const now = new Date('2026-07-22T12:00:00.000Z');
    jest.setSystemTime(now);

    const target = new Date(now.getTime() + 10 * 1000); // +10s
    render(<CountdownTimer targetDate={target.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('10');

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('07');
  });
});
