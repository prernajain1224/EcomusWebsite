import { create } from "zustand";
import toast from "react-hot-toast";
import {
  addWishlist,
  deleteWishlist,
  getWishlists,
  moveWishlistToCart,
} from "../api/account";
import { useCartStore } from "./cartStore";

const getFirstArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.wishlists)) return value.wishlists;
  if (Array.isArray(value?.wishlist)) return value.wishlist;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const getItemImage = (item) =>
  item?.display_image ||
  item?.image ||
  item?.product?.display_image ||
  item?.product?.image ||
  item?.product_variant?.display_image ||
  item?.product_variant?.image ||
  "/product-placeholder.svg";

const normalizeWishlistItem = (item) => {
  const variantId =
    item?.product_variant_id ||
    item?.variant_id ||
    item?.product_variant?.id ||
    item?.variant?.id ||
    null;
  const productId =
    item?.product_id ||
    item?.product?.id ||
    item?.product_variant?.product_id ||
    null;
  const slug = item?.slug || item?.product?.slug || null;
  const name =
    item?.name ||
    item?.product_name ||
    item?.product?.name ||
    "Wishlist Product";
  const price =
    Number(
      item?.price ?? item?.product?.price ?? item?.product_variant?.price,
    ) || 0;

  return {
    ...item,
    id: item?.id ?? null,
    wishlist_id: item?.id ?? null,
    product_variant_id: variantId,
    product_id: productId,
    slug,
    name,
    price,
    image: getItemImage(item),
  };
};

export const getPreferredVariantId = (product) =>
  product?.product_variant_id ||
  product?.variant_id ||
  product?.default_variant_id ||
  product?.product_variants?.[0]?.id ||
  product?.id ||
  null;

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  loadingWishlistId: null,
  loadingWishlistVariantId: null,

  fetchWishlist: async () => {
    if (!localStorage.getItem("Token")) return;
    try {
      set({ loading: true });
      const res = await getWishlists();
      const list = getFirstArray(res).map(normalizeWishlistItem);
      set({ wishlist: list });
    } catch (err) {
      if (err === "sessionTimeout") {
        localStorage.removeItem("Token");
        localStorage.removeItem("userType");
        set({ wishlist: [] });
        window.location.href = "/login";
        return;
      }
      toast.error(err || "Failed to load wishlist");
    } finally {
      set({ loading: false });
    }
  },

  isInWishlist: (variantId) => {
    const list = get().wishlist;
    if (!variantId) return false;
    return list.some((item) => item.product_variant_id === variantId);
  },

  addToWishlist: async (productVariantId) => {
    if (!productVariantId) {
      toast.error("Variant not available for wishlist");
      return false;
    }
    try {
      set({
        loading: true,
        loadingWishlistId: productVariantId,
        loadingWishlistVariantId: productVariantId,
      });
      set((state) => {
        const exists = state.wishlist.some(
          (item) => item.product_variant_id === productVariantId,
        );
        if (exists) return state;
        return {
          wishlist: [
            {
              id: productVariantId,
              wishlist_id: null,
              product_variant_id: productVariantId,
            },
            ...state.wishlist,
          ],
        };
      });
      await addWishlist(productVariantId);
      toast.success("Added to wishlist");
      set({ loadingWishlistId: null, loadingWishlistVariantId: null });
      await get().fetchWishlist();
      return true;
    } catch (err) {
      if (err === "sessionTimeout") {
        localStorage.removeItem("Token");
        localStorage.removeItem("userType");
        set({ wishlist: [] });
        window.location.href = "/login";
        return false;
      }
      toast.error(err || "Failed to add to wishlist");
      return false;
    } finally {
      set({
        loading: false,
        loadingWishlistId: null,
        loadingWishlistVariantId: null,
      });
    }
  },

  removeFromWishlist: async (wishlistId) => {
    if (!wishlistId) return false;
    try {
      set({ loading: true, loadingWishlistId: wishlistId });
      set((state) => ({
        wishlist: state.wishlist.filter(
          (item) =>
            item.wishlist_id !== wishlistId &&
            item.id !== wishlistId &&
            item.product_variant_id !== wishlistId,
        ),
      }));
      await deleteWishlist(wishlistId);
      toast.success("Removed from wishlist");
      await get().fetchWishlist();
      return true;
    } catch (err) {
      if (err === "sessionTimeout") {
        localStorage.removeItem("Token");
        localStorage.removeItem("userType");
        set({ wishlist: [] });
        window.location.href = "/login";
        return false;
      }
      toast.error(err || "Failed to remove wishlist item");
      return false;
    } finally {
      set({ loading: false, loadingWishlistId: null });
    }
  },

  moveToCart: async ({ wishlistId, cartId = null, quantity = 1 }) => {
    if (!wishlistId) return false;
    try {
      set({ loading: true, loadingWishlistId: wishlistId });
      const item = get().wishlist.find(
        (w) => w.wishlist_id === wishlistId || w.id === wishlistId,
      );
      set((state) => ({
        wishlist: state.wishlist.filter(
          (entry) =>
            entry.wishlist_id !== wishlistId &&
            entry.id !== wishlistId &&
            entry.product_variant_id !== wishlistId,
        ),
      }));
      await moveWishlistToCart({ id: wishlistId, cart_id: cartId, quantity });
      if (item) {
        useCartStore.getState().addToCart(
          {
            id: item.product_variant_id || item.product_id || wishlistId,
            product_variant_id:
              item.product_variant_id || item.variant_id || item.id,
            product_size_id: item.product_size_id || item.size_id || null,
            product_id: item.product_id,
            slug: item.slug,
            title: item.name,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          quantity,
        );
      }
      toast.success("Moved to cart");
      await get().fetchWishlist();
      return true;
    } catch (err) {
      if (err === "sessionTimeout") {
        localStorage.removeItem("Token");
        localStorage.removeItem("userType");
        set({ wishlist: [] });
        window.location.href = "/login";
        return false;
      }
      toast.error(err || "Failed to move item to cart");
      return false;
    } finally {
      set({ loading: false, loadingWishlistId: null });
    }
  },

  clearWishlistLocal: () => set({ wishlist: [] }),
}));
