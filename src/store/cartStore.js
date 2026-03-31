import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import {
  createCart,
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  mergeCart,
} from "../api/cart";
import { OK } from "../utils"; // "ok" constant

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartId: null, // persisted in localStorage
      cartData: null, // { items, items_count, subtotal, currency }
      loading: false,

      // ─────────────────────────────────────────────
      // INIT — call once on app load
      // ─────────────────────────────────────────────
      initCart: async () => {
        const { cartId, fetchCart } = get();

        if (cartId) {
          try {
            await fetchCart();
            if (get().cartData) return;
          } catch (err) {
            console.error("Existing cart load failed:", err);
          }
        }

        try {
          const res = await createCart();
          if (res?.status === OK && res?.cart_id) {
            set({ cartId: res.cart_id });
            await get().fetchCart();
          } else {
            console.error("Cart init failed:", res?.error);
          }
        } catch (err) {
          console.error("Cart init failed:", err);
          set({ cartId: null, cartData: null });
        }
      },

      // ─────────────────────────────────────────────
      // FETCH — refresh cart data from server
      // ─────────────────────────────────────────────
      fetchCart: async () => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          set({ loading: true });
          const res = await getCart(cartId);
          if (res?.status === OK) {
            set({ cartData: res.cart }); // res.cart = { items, items_count, subtotal, currency }
          } else {
            console.error("Fetch cart failed:", res?.error);
            set({ cartId: null, cartData: null });
          }
        } catch (err) {
          console.error("Fetch cart failed:", err);
          set({ cartId: null, cartData: null });
        } finally {
          set({ loading: false });
        }
      },

      // ─────────────────────────────────────────────
      // ADD ITEM
      // ─────────────────────────────────────────────
      addToCart: async (item, quantity = 1) => {
        let { cartId, fetchCart } = get();

        const product_variant_id = item?.product_variant_id ?? item?.id;
        const product_size_id = item?.product_size_id ?? item?.size_id;

        if (!product_variant_id) {
          toast.error("Product variant not found");
          return;
        }

        if (!product_size_id) {
          toast.error("Please select a size");
          return;
        }

        try {
          set({ loading: true });

          if (!cartId) {
            const created = await createCart();
            if (created?.status === OK && created?.cart_id) {
              cartId = created.cart_id;
              set({ cartId });
            } else {
              toast.error(created?.error || "Could not create cart");
              return;
            }
          }

          const res = await addItemToCart({
            cart_id: cartId,
            product_variant_id,
            product_size_id,
            quantity,
          });
          if (res?.status === OK) {
            await fetchCart();
            toast.success("Added to cart");
          } else {
            toast.error(res?.error || "Could not add to cart");
          }
        } catch (err) {
          toast.error(err?.message || "Could not add to cart");
        } finally {
          set({ loading: false });
        }
      },

      // ─────────────────────────────────────────────
      // UPDATE QTY — quantity 0 = remove
      // ─────────────────────────────────────────────
      updateQty: async (cart_item_id, quantity) => {
        const { cartId, fetchCart } = get();
        if (!cartId) return;

        try {
          set({ loading: true });
          const res = await updateCartItem({
            cart_id: cartId,
            cart_item_id,
            quantity,
          });
          if (res?.status === OK) {
            await fetchCart();
            if (quantity === 0) toast("Removed from cart");
            else toast.success("Quantity updated");
          } else {
            toast.error(res?.error || "Could not update cart");
          }
        } catch (err) {
          toast.error(err?.message || "Could not update cart");
        } finally {
          set({ loading: false });
        }
      },

      // ─────────────────────────────────────────────
      // REMOVE ITEM
      // ─────────────────────────────────────────────
      removeFromCart: async (cart_item_id) => {
        const { cartId, fetchCart } = get();
        if (!cartId) return;

        try {
          set({ loading: true });
          const res = await removeCartItem({ cart_id: cartId, cart_item_id });
          if (res?.status === OK) {
            await fetchCart();
            toast("Removed from cart");
          } else {
            toast.error(res?.error || "Could not remove item");
          }
        } catch (err) {
          toast.error(err?.message || "Could not remove item");
        } finally {
          set({ loading: false });
        }
      },

      // ─────────────────────────────────────────────
      // MERGE — call after login/register
      // ─────────────────────────────────────────────
      mergeCartAfterLogin: async (newCartId) => {
        const { cartId } = get();
        const guestCartId = cartId;

        // set new cart id first
        set({ cartId: newCartId });

        if (guestCartId && guestCartId !== newCartId) {
          try {
            const res = await mergeCart({ guest_cart_id: guestCartId });
            if (res?.status !== OK) {
              console.error("Cart merge failed:", res?.error);
            }
          } catch (err) {
            console.error("Cart merge failed:", err);
          }
        }

        await get().fetchCart();
      },

      // ─────────────────────────────────────────────
      // CLEAR — on logout
      // ─────────────────────────────────────────────
      clearCart: () => set({ cartId: null, cartData: null }),

      // ─────────────────────────────────────────────
      // HELPERS
      // ─────────────────────────────────────────────
      itemsCount: () => get().cartData?.items_count ?? 0,
      subtotal: () => get().cartData?.subtotal ?? 0,
    }),

    {
      name: "huehoppers-cart",
      // only cartId persists — cartData always fresh from server
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);
