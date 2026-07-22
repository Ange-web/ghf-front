import { render, screen } from '@testing-library/react';
import TestimonialCard from '@/components/TestimonialCard';

describe('TestimonialCard', () => {
  it('affiche le contenu, l’auteur et l’initiale quand toutes les données sont présentes', () => {
    const testimonial = {
      id: 't1',
      rating: 4,
      content: 'Super soirée !',
      authorName: 'Alice',
    };

    render(<TestimonialCard testimonial={testimonial} />);

    expect(screen.getByText('"Super soirée !"')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  // Non-régression : un ?. a été ajouté après charAt(0) pour éviter un crash
  // quand authorName est absent (undefined/null) — voir git history.
  it('ne plante pas et affiche les valeurs par défaut quand authorName est manquant', () => {
    const testimonial = {
      id: 't2',
      rating: 5,
      content: 'Anonyme mais ravi',
      // authorName volontairement absent
    };

    expect(() => render(<TestimonialCard testimonial={testimonial} />)).not.toThrow();

    expect(screen.getByText('Utilisateur anonyme')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('ne plante pas non plus quand authorName est une chaîne vide', () => {
    const testimonial = {
      id: 't3',
      rating: 3,
      content: 'Test chaîne vide',
      authorName: '',
    };

    expect(() => render(<TestimonialCard testimonial={testimonial} />)).not.toThrow();
    expect(screen.getByText('Utilisateur anonyme')).toBeInTheDocument();
  });
});
