import React, { useEffect, useMemo } from "react";
import CartPage from "../components/CartPage";
import Testimonial from "../components/Testimonial";
import YouMayProduct from "../components/YouMayProduct";
import { useCartStore } from "../store/cartStore";
import { PageTitle } from "../components/PageTitle";

const Cart = () => {
  const initCart = useCartStore((state) => state.initCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartData = useCartStore((state) => state.cartData);
  const loading = useCartStore((state) => state.loading);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => {
    initCart();
  }, [initCart]);

  useEffect(() => {
    if (cartData) return;
    fetchCart();
  }, [cartData, fetchCart]);

  const initialCartItems = useMemo(() => {
    return (cartData?.items || []).map((item) => ({
      id: item.id,
      product_slug: item.product_slug,
      title: item.product_name || item.name || "Cart Item",
      color: item.variant_color || item.color || "N/A",
      size: item.variant_size || item.size || "N/A",
      price: Number(item.price || item.product_price || 0),
      quantity: Number(item.quantity || 1),
      image:
        item.image_url ||
        item.display_image ||
        item.product_image ||
        "/product-placeholder.svg",
    }));
  }, [cartData]);

  return (
    <>
      <PageTitle
        title="Shopping Cart"
        subtitle="Your mood cart! Pick your hues and checkout!"
        bgImage="cartCheckoutBanner.png"
      />

      <CartPage
        initialCartItems={initialCartItems}
        isLoading={loading}
        onUpdateQuantity={updateQty}
        onRemoveItem={removeFromCart}
      />
      <Testimonial />
      <YouMayProduct />
    </>
  );
};

export default Cart;
