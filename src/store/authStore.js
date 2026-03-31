import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * useAuthStore — HueHoppers Auth Store
 * Persisted to localStorage via zustand/middleware
 *
 * State:
 * - token: JWT auth token
 * - user: { name, email, mobile }
 * - is_email_verified: boolean
 * - guest_cart_id: string | null (cart id before login)
 *
 * Actions:
 * - setAuth(token, user, is_email_verified) — called after login/register
 * - setEmailVerified() — called after email verification
 * - setGuestCartId(id) — set guest cart before login
 * - clearGuestCartId() — clear after merging with user cart
 * - logout() — clear everything
 */

export const useAuthStore = create(
  persist(
    (set) => ({
      // ── State ──────────────────────────────────────────────
      token: null,
      user: null, // { name, email, mobile }
      is_email_verified: false,
      guest_cart_id: null,

      // ── Actions ────────────────────────────────────────────

      // Called after successful login or register
      setAuth: (token, user, is_email_verified = false) =>
        set({
          token,
          user,
          is_email_verified,
        }),

      // Called after email verification success
      setEmailVerified: () => set({ is_email_verified: true }),

      // Set guest cart id before user logs in
      setGuestCartId: (id) => set({ guest_cart_id: id }),

      // Clear guest cart after merging with user cart on login
      clearGuestCartId: () => set({ guest_cart_id: null }),

      // Full logout — clears everything
      logout: () =>
        set({
          token: null,
          user: null,
          is_email_verified: false,
          guest_cart_id: null,
        }),
    }),
    {
      name: "hh-auth", // localStorage key
      partialize: (state) => ({
        // Only persist these — actions are not persisted
        token: state.token,
        user: state.user,
        is_email_verified: state.is_email_verified,
        guest_cart_id: state.guest_cart_id,
      }),
    },
  ),
);

// ── Selectors (use these in components for clean reads) ──────
export const useToken = () => useAuthStore((s) => s.token);
export const useUser = () => useAuthStore((s) => s.user);
export const useIsLoggedIn = () => useAuthStore((s) => !!s.token);
export const useIsEmailVerified = () =>
  useAuthStore((s) => s.is_email_verified);
export const useGuestCartId = () => useAuthStore((s) => s.guest_cart_id);
