import { renderHook, waitFor } from '@testing-library/react';
import { useApi, invalidateCache } from '@/hooks/useApi';
import api from '@/lib/api';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

describe('useApi', () => {
  beforeEach(() => {
    invalidateCache();
    api.get.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('démarre en chargement puis renvoie les données au succès', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [{ id: 1, name: 'Event A' }] } });

    const { result } = renderHook(() => useApi('/api/events'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1, name: 'Event A' }]);
    expect(result.current.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/api/events', expect.any(Object));
  });

  it('expose une erreur quand la requête échoue', async () => {
    api.get.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useApi('/api/fail'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });

  it('ne fait aucun appel quand enabled=false', async () => {
    const { result } = renderHook(() => useApi('/api/disabled', { enabled: false }));

    expect(api.get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('sert les données en cache instantanément lors d’un second montage', async () => {
    api.get.mockResolvedValueOnce({ data: { data: { cached: true } } });

    const first = renderHook(() => useApi('/api/cached'));
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();

    api.get.mockResolvedValueOnce({ data: { data: { cached: true } } });

    const second = renderHook(() => useApi('/api/cached'));
    // Donnée servie immédiatement depuis le cache, sans passer par "loading"
    expect(second.result.current.data).toEqual({ cached: true });
    expect(second.result.current.loading).toBe(false);
  });
});
