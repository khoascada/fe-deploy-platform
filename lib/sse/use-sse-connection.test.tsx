import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSseConnection } from './use-sse-connection';

const { createSseConnection, disconnect } = vi.hoisted(() => ({
  createSseConnection: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('./sse-client', () => ({
  createSseConnection,
}));

describe('useSseConnection', () => {
  it('opens one connection and disconnects it on unmount', () => {
    createSseConnection.mockReturnValue({ disconnect });

    const { rerender, unmount } = renderHook(() => useSseConnection());

    rerender();
    expect(createSseConnection).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
