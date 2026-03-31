import "../App.css";
import { useEffect, useState } from "react";
import ProductTitle from "../components/ProductSection/ProductTitle";
import ProductDetailPage from "../components/ProductSection/ProductDetail";
import PeopleAlsoBought from "../components/ProductSection/PeopleAlsoBought";
import ProductRecentlyViewed from "../components/ProductSection/ProductRecentlyViewed";
import { useParams } from "react-router-dom";
import { getProductDetails, getProducts } from "../api/products";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [productRes, productsRes] = await Promise.all([
          getProductDetails(slug),
          getProducts(1),
        ]);
        if (!alive) return;
        const currentProduct = productRes?.product || productRes;
        setProduct(currentProduct);

        const viewedProduct = {
          id: currentProduct?.id,
          title: currentProduct?.name,
          price: currentProduct?.price,
          url: `/product/${currentProduct?.slug || currentProduct?.id}`,
          mainImage:
            currentProduct?.display_image ||
            currentProduct?.image ||
            currentProduct?.product_images?.[0]?.image_url ||
            currentProduct?.product_images?.[0]?.url ||
            currentProduct?.product_images?.[0]?.image ||
            "/product-placeholder.svg",
          hoverImage:
            currentProduct?.display_image ||
            currentProduct?.image ||
            currentProduct?.product_images?.[0]?.image_url ||
            currentProduct?.product_images?.[0]?.url ||
            currentProduct?.product_images?.[0]?.image ||
            "/product-placeholder.svg",
          colors: currentProduct?.product_variants?.map((variant) => ({
            name: variant?.color?.name || variant?.color_name || variant?.name,
            bgClass: "bg_white",
            image:
              variant?.variant_images?.[0]?.image_url ||
              variant?.variant_images?.[0]?.url ||
              variant?.variant_images?.[0]?.image ||
              currentProduct?.display_image ||
              currentProduct?.image ||
              "/product-placeholder.svg",
          })) || [],
          sizes: currentProduct?.product_sizes?.map((size) => size?.name).filter(Boolean) || [],
        };

        const storedViewed = JSON.parse(
          localStorage.getItem("recently_viewed_products") || "[]",
        );
        const mergedViewed = [
          viewedProduct,
          ...storedViewed.filter((item) => item.id !== viewedProduct.id),
        ].slice(0, 8);
        localStorage.setItem(
          "recently_viewed_products",
          JSON.stringify(mergedViewed),
        );

        setRelatedProducts(
          (productsRes?.products || [])
            .filter((item) => item.id !== currentProduct?.id)
            .slice(0, 8)
            .map((item) => ({
              ...item,
              url: `/product/${item.slug || item.id}`,
              mainImage: item.display_image || item.image || item.mainImage,
              hoverImage: item.display_image || item.image || item.hoverImage,
              title: item.name,
              price: item.price,
            })),
        );
        const stored = localStorage.getItem("recently_viewed_products");
        setRecentlyViewed(
          stored
            ? JSON.parse(stored)
                .slice(0, 8)
                .map((item) => ({
                  ...item,
                  url: `/product/${item.slug || item.id}`,
                  mainImage: item.display_image || item.image || item.mainImage,
                  hoverImage: item.display_image || item.image || item.hoverImage,
                  title: item.name || item.title,
                  price: item.price,
                }))
            : [],
        );
      } catch {
        if (!alive) return;
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <>
      <ProductTitle product={product} />
      <ProductDetailPage productData={product} />
      <PeopleAlsoBought products={relatedProducts} />
      <ProductRecentlyViewed products={recentlyViewed} />
    </>
  );
};

export default ProductDetail;
