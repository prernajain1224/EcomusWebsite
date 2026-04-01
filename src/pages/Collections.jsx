import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { getCollections } from "../api/collections";
import { OK, showErrorMessage } from "../utils";
import { getImageUrl } from "../api/utils";

const FALLBACK_PRODUCT_IMAGE = "/assets/images/product-placeholder.svg";

// ── Collection Item ──────────────────────────────────────────
const CollectionItem = ({ collection }) => {
  return (
    <div className="collection-item hover-img">
      <div className="collection-inner">
        <Link
          to={`/collections/${collection.slug}`}
          className="collection-image img-style"
        >
          <img
            className="lazyload"
            src={getImageUrl(collection.banner_image) || FALLBACK_PRODUCT_IMAGE}
            alt={collection.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
            }}
            decoding="async"
            loading="lazy"
            data-src={collection.image}
            alt={collection.title || "collection-img"}
          />
        </Link>
        <div className="collection-content">
          <Link
            to={`/collections/${collection.slug}`}
            className="tf-btn collection-title hover-icon"
          >
            <span>{collection.name}</span>
            <i className="icon icon-arrow1-top-left" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Main Collections Page ────────────────────────────────────
const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Refs to handle infinite scroll safely
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    loadCollections(currentPage);
  }, [currentPage]);

  const loadCollections = async (page) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await getCollections(page);
      if (res?.status === OK) {
        const next = res?.collections || [];
        setCollections((prev) => {
          if (page === 1) return next;
          // Deduplicate by id to avoid doubles on re-render
          const ids = new Set(prev.map((c) => c.id));
          return [...prev, ...next.filter((c) => !ids.has(c.id))];
        });
        const totalPages = res?.pagination?.total_pages || 1;
        setHasMore(page < totalPages && next.length > 0);
      }
    } catch (err) {
      showErrorMessage(err || "Failed to load collections");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  // ── Infinite Scroll via IntersectionObserver ─────────────
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
  }, [hasMore, loading, collections.length]);

  return (
    <>
      <PageTitle
        title="Collections"
        subtitle="Hop Into A World!"
        bgImage="collectionsBanner.png"
      />

      <section className="flat-spacing-1">
        <div className="container">
          {/* ── Loading Skeleton ── */}
          {loading && (
            <div className="tf-grid-layout xl-col-3 tf-col-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="collection-item">
                  <div className="collection-inner">
                    <div
                      style={{
                        background: "#e0e0e0",
                        width: "100%",
                        height: 300,
                        borderRadius: 4,
                        animation: "pulse 1.4s ease-in-out infinite",
                      }}
                    />
                    <div
                      style={{
                        background: "#e0e0e0",
                        height: 20,
                        width: "50%",
                        marginTop: 12,
                        borderRadius: 4,
                        animation: "pulse 1.4s ease-in-out infinite",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && collections.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#888", fontSize: 15 }}>
                No collections found. Check back soon! 🌈
              </p>
            </div>
          )}

          {/* ── Collections Grid ── */}
          {!loading && collections.length > 0 && (
            <div className="tf-grid-layout xl-col-3 tf-col-2">
              {collections.map((collection) => (
                <CollectionItem key={collection.id} collection={collection} />
              ))}
            </div>
          )}

          {/* ── Infinite Scroll Sentinel ── */}
          {!loading && hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <div ref={sentinelRef} style={{ height: 1, width: 1 }} />
            </div>
          )}

          {/* ── Loading More Indicator ── */}
          {loadingMore && (
            <p style={{ textAlign: "center", color: "#666", margin: "12px 0" }}>
              Loading more collections...
            </p>
          )}

          {/* ── End of List ── */}
          {!hasMore && collections.length > 0 && (
            <p style={{ textAlign: "center", color: "#666", margin: "12px 0" }}>
              You've seen them all! 🎉
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Collections;
