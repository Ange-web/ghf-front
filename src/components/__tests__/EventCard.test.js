import { render, screen } from '@testing-library/react';
import EventCard from '@/components/EventCard';

const baseEvent = {
  id: 'evt-1',
  title: 'Soirée Néon',
  description: 'Une nuit électrique au cœur de Paris.',
  date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  venue: 'Le Klub',
  price: 25,
  capacity: 100,
  spotsLeft: 40,
  category: 'VIP',
};

describe('EventCard', () => {
  it('affiche le titre, le lieu et le prix formaté', () => {
    render(<EventCard event={baseEvent} />);

    expect(screen.getByText('Soirée Néon')).toBeInTheDocument();
    expect(screen.getByText('Le Klub')).toBeInTheDocument();
    // Le prix est affiché à deux endroits (badge sur l'image + bloc de contenu)
    expect(screen.getAllByText('25€').length).toBeGreaterThan(0);
    expect(screen.getByText(/places restantes/)).toBeInTheDocument();
  });

  it('affiche "Gratuit" quand le prix est 0', () => {
    render(<EventCard event={{ ...baseEvent, price: 0 }} />);
    // Le prix est affiché à deux endroits (badge sur l'image + bloc de contenu)
    expect(screen.getAllByText('Gratuit').length).toBeGreaterThan(0);
  });

  it('indique "Complet" quand il ne reste plus de places', () => {
    render(<EventCard event={{ ...baseEvent, spotsLeft: 0 }} />);
    expect(screen.getAllByText('Complet').length).toBeGreaterThan(0);
  });

  it('supporte les champs API legacy (available_spots / image_url)', () => {
    const legacyEvent = {
      ...baseEvent,
      spotsLeft: undefined,
      available_spots: 30, // 30% de la capacité -> au-dessus du seuil "presque complet"
      image_url: 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg',
    };
    render(<EventCard event={legacyEvent} />);
    expect(screen.getByText('30 places restantes')).toBeInTheDocument();
  });

  it('affiche le compte à rebours et le CTA en mode "featured"', () => {
    render(<EventCard event={baseEvent} featured />);
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument();
    expect(screen.getByTestId(`book-event-${baseEvent.id}`)).toBeInTheDocument();
  });
});
