import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { getProducts, getFilters } from "../api/products";
import { getImageUrl } from "../api/utils";
import { OK, showErrorMessage } from "../utils";
import { getCollectionDetails } from "../api/collections";
import ProductCard from "../components/ProductCard";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

// ── Single Product Card ───────────────────────────────────────

// ── Loading Skeleton ──────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="card-product grid">
    <div className="card-product-wrapper">
      <div
        style={{
          background: "#f4f3ef",
          paddingTop: "120%",
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
    </div>
    <div className="card-product-info" style={{ padding: "12px 0" }}>
      <div
        style={{
          background: "#f4f3ef",
          height: 14,
          width: "70%",
          marginBottom: 8,
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          background: "#f4f3ef",
          height: 14,
          width: "40%",
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
    </div>
  </div>
);

// ── Main Products Page ────────────────────────────────────────
const CollectionDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const [collection, setCollection] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("menu_order");

  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, sortBy]);

  const loadProducts = async (page) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await getProducts(page, {
        collection_id: slug,
        sort: sortBy,
      });

      if (res?.status === OK) {
        const next = res?.products || [];
        setProducts((prev) => {
          if (page === 1) return next;
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...next.filter((p) => !ids.has(p.id))];
        });
        const totalPages = res?.pagination?.total_pages || 1;
        setHasMore(page < totalPages && next.length > 0);
      }
    } catch (err) {
      showErrorMessage(err || "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      try {
        const res = await getCollectionDetails(slug);
        console.log("Collection details response:", res);
        if (!res || !res.id) {
          throw "Collection not found";
          return <Navigate to="/collections" replace />;
        }
        setCollection(res || {});
      } catch (err) {
        showErrorMessage(err || "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };
    loadCollection();
  }, [slug]);

  // ── Infinite Scroll ───────────────────────────────────────
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          setCurrentPage((p) => p + 1);
        }
      },
      { rootMargin: "220px 0px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, products.length]);

  return (
    <>
      {!loading ? (
        <PageTitle
          title={collection?.name || "Collection"}
          subtitle={collection?.description || "Find Your Hue!"}
          bgImage={getImageUrl(collection?.banner_image) || FALLBACK_IMAGE}
        />
      ) : null}

      <section className="flat-spacing-1">
        <div className="container">
          {/* ── Top Controls ── */}
          <div className="tf-shop-control grid-3 align-items-center">
            {/* Filter button — handled by ProductSidebar floating button */}

            <div></div>

            {/* Breadcrumb */}
            <ul></ul>

            {/* Sort */}
            <div className="tf-control-sorting d-flex justify-content-end">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setProducts([]);
                  setCurrentPage(1);
                  setHasMore(true);
                }}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#2c3a34",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="menu_order">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="date">Sort by latest</option>
                <option value="price">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="active-filters mb_30">
            {/* ── Products Grid ── */}
            {loading ? (
              <div
                className="tf-grid-layout wrapper-shop tf-col-4"
                id="gridLayout"
                style={{
                  width: "100%",
                  display: "grid",
                  gap: 24,
                  margin: "20px 0 60px",
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={`initial-${i}`} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div
                className="wrapper-control-shop tf-shop-content"
                style={{
                  minHeight: "420px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "560px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2c3a34",
                      marginBottom: 8,
                    }}
                  >
                    No products found!
                  </p>
                  <p style={{ fontSize: 14, color: "#888" }}>
                    Try adjusting your filters or{" "}
                    <Link
                      to="/collections"
                      style={{ color: "#2c3a34", fontWeight: 600 }}
                    >
                      browse collections
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="tf-grid-layout wrapper-shop tf-col-4"
                id="gridLayout"
              >
                {/* Product cards */}
                {!loading &&
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}

                {/* Load more indicator */}
                {loadingMore &&
                  [...Array(3)].map((_, i) => (
                    <ProductSkeleton key={`more-${i}`} />
                  ))}
              </div>
            )}
          </div>

          {/* ── Infinite Scroll Sentinel ── */}
          {!loading && hasMore && (
            <div ref={sentinelRef} style={{ height: 1, width: 1 }} />
          )}

          {/* End of products */}
          {!loading && !hasMore && products.length > 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#888",
                padding: "24px 0",
                fontSize: 14,
              }}
            >
              You've seen all products! 🌈
            </p>
          )}
        </div>
      </section>

      {/* Mobile filter button (for sidebar) */}
      <div className="btn-sidebar-style2">
        <button>
          <i className="icon icon-sidebar-2" />
        </button>
      </div>
    </>
  );
};

export default CollectionDetail;
