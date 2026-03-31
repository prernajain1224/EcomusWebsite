import {
  CARTS,
  ADD_ITEM_TO_CART,
  UPDATE_ITEM_IN_CART,
  REMOVE_ITEM_FROM_CART,
  getWrapper,
  returnOrThrow,
} from "./utils";

// POST /api/carts — create guest cart
export const createCart = async () => {
  const resJSON = await fetch(CARTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

// GET /api/carts/:id — fetch cart with items
export const getCart = async (cartId) => {
  const resJSON = await getWrapper(`${CARTS}/${cartId}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

// POST /api/carts/add_item
export const addItemToCart = async ({
  cart_id,
  product_variant_id,
  product_size_id,
  quantity,
}) => {
  const resJSON = await fetch(ADD_ITEM_TO_CART, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_id,
      product_variant_id,
      product_size_id,
      quantity,
    }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

// PUT /api/carts/update_item — quantity 0 = remove
export const updateCartItem = async ({ cart_id, cart_item_id, quantity }) => {
  const resJSON = await fetch(UPDATE_ITEM_IN_CART, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart_id, cart_item_id, quantity }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

// DELETE /api/carts/remove_item
export const removeCartItem = async ({ cart_id, cart_item_id }) => {
  const resJSON = await fetch(REMOVE_ITEM_FROM_CART, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart_id, cart_item_id }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

// POST /api/carts/merge — authenticated only
export const mergeCart = async ({ guest_cart_id }) => {
  const token = localStorage.getItem("Token");
  const resJSON = await fetch(`${CARTS}/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
    },
    body: JSON.stringify({ guest_cart_id }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};
