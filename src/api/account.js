import {
  ADDRESSES,
  CHANGE_PASSWORD,
  NOTIFICATIONS,
  PROFILE,
  WISHLISTS,
  authedFetch,
} from "./utils";

export const getAddresses = async () => authedFetch(ADDRESSES, "GET");

export const createAddress = async (payload) =>
  authedFetch(ADDRESSES, "POST", payload);

export const updateAddress = async (id, payload) =>
  authedFetch(`${ADDRESSES}/${id}`, "PUT", payload);

export const deleteAddress = async (id) =>
  authedFetch(`${ADDRESSES}/${id}`, "DELETE");

export const setDefaultAddress = async (id) =>
  authedFetch(`${ADDRESSES}/${id}/set_default`, "PUT");

export const getProfile = async () => authedFetch(PROFILE, "GET");

export const updateProfile = async (payload) =>
  authedFetch(PROFILE, "PUT", payload);

export const changePassword = async (payload) =>
  authedFetch(CHANGE_PASSWORD, "PUT", payload);

export const getWishlists = async () => authedFetch(WISHLISTS, "GET");

export const addWishlist = async (productVariantId) =>
  authedFetch(WISHLISTS, "POST", { product_variant_id: productVariantId });

export const deleteWishlist = async (id) =>
  authedFetch(`${WISHLISTS}/${id}`, "DELETE");

export const moveWishlistToCart = async ({ id, cart_id, quantity = 1 }) =>
  authedFetch(`${WISHLISTS}/${id}/move_to_cart`, "POST", { cart_id, quantity });

export const getNotifications = () => authedFetch(`${NOTIFICATIONS}`, "GET");

export const markNotificationRead = (id) =>
  authedFetch(`${NOTIFICATIONS}/${id}/mark_read`, "PUT");

export const markAllNotificationsRead = () =>
  authedFetch(`${NOTIFICATIONS}/mark_all_read`, "PUT");
