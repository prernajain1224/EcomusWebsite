import { useState, useEffect } from "react";
import { getFilters } from "../api/products";

/**
 * ProductFilters — offcanvas filter drawer
 * Props:
 * - open: boolean
 * - onClose: function
 * - onFilterChange: function({ priceMin, priceMax, colors, sizes, product_types, genders, collections })
 * - collectionId: optional string
 */
const ProductFilters = ({
  open,
  onClose,
  onFilterChange,
  collectionId = "",
}) => {
  const [data, setData] = useState(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // ── Load filters from API ─────────────────────────────────
  useEffect(() => {
    getFilters(collectionId ? { collection_id: collectionId } : {}).then(
      (res) => {
        if (res?.status === "ok") {
          setData(res);
          setPriceMin(Number(res.price_range?.min) || 0);
          setPriceMax(Number(res.price_range?.max) || 5000);
        }
      },
    );
  }, [collectionId]);

  if (!open) return null;

  // ── Deduplicate colors by hex value ──────────────────────
  const uniqueColors = data?.colors
    ? [...new Map(data.colors.map((c) => [c.color, c])).values()]
    : [];

  const emit = (overrides = {}) => {
    onFilterChange?.({
      priceMin,
      priceMax,
      colors: selectedColors,
      sizes: selectedSizes,
      product_types: selectedProductTypes,
      genders: selectedGenders,
      collections: selectedCollections,
      ...overrides,
    });
  };

  const toggleItem = (list, setList, value, key) => {
    const updated = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    setList(updated);
    emit({ [key]: updated });
  };

  const handleClearAll = () => {
    setPriceMin(Number(data?.price_range?.min) || 0);
    setPriceMax(Number(data?.price_range?.max) || 5000);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedProductTypes([]);
    setSelectedGenders([]);
    setSelectedCollections([]);
    onFilterChange?.({
      priceMin: Number(data?.price_range?.min) || 0,
      priceMax: Number(data?.price_range?.max) || 5000,
      colors: [],
      sizes: [],
      product_types: [],
      genders: [],
      collections: [],
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1055,
        }}
      />

      {/* Drawer */}
      <div
        className="offcanvas offcanvas-start canvas-filter show"
        style={{ visibility: "visible", zIndex: 1060 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="canvas-wrapper">
          {/* Header */}
          <header className="canvas-header">
            <div className="filter-icon">
              <span className="icon icon-filter" />
              <span>Filter</span>
            </div>
            <span
              className="icon-close icon-close-popup"
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </header>

          <div className="canvas-body">
            {/* ── Product Types (API) ── */}
            {data?.product_types?.length > 0 && (
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Product Types</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <ul className="list-categoris current-scrollbar mb_36">
                  {data.product_types.map((type) => {
                    const value =
                      typeof type === "string"
                        ? type
                        : type.slug ||
                          type.product_type ||
                          type.value ||
                          type.name ||
                          "";
                    const label =
                      typeof type === "string"
                        ? type
                        : type.name ||
                          type.title ||
                          type.label ||
                          type.product_type ||
                          type.value ||
                          "Product type";
                    const count =
                      typeof type === "string"
                        ? null
                        : (type.count ??
                          type.products_count ??
                          type.product_count ??
                          type.total ??
                          null);
                    return (
                      <li
                        key={value || label}
                        className={`cate-item${selectedProductTypes.includes(value) ? " current" : ""}`}
                        onClick={() =>
                          toggleItem(
                            selectedProductTypes,
                            setSelectedProductTypes,
                            value,
                            "product_types",
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          <span>{label}</span>
                          {count !== null && count !== undefined ? (
                            <>
                              &nbsp;<span>({count})</span>
                            </>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ── Collections (API) ── */}
            {data?.collections?.length > 0 && (
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Collections</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <ul className="list-categoris current-scrollbar mb_36">
                  {data.collections.map((collection) => (
                    <li
                      key={collection.id}
                      className={`cate-item${selectedCollections.includes(collection.slug) ? " current" : ""}`}
                      onClick={() =>
                        toggleItem(
                          selectedCollections,
                          setSelectedCollections,
                          collection.slug,
                          "collections",
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <span>{collection.name}</span>&nbsp;
                        <span>({collection.count})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Genders (API) ── */}
            {data?.genders?.length > 0 && (
              <div className="widget-facet">
                <div className="facet-title">
                  <span style={{ textTransform: "none" }}>Gender</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <ul className="list-categoris current-scrollbar mb_36">
                  {data.genders.map((gender) => {
                    const label =
                      typeof gender === "string"
                        ? gender.charAt(0).toUpperCase() + gender.slice(1)
                        : gender?.name ||
                          gender?.label ||
                          gender?.value ||
                          "Gender";
                    const value =
                      typeof gender === "string"
                        ? gender
                        : gender?.value ||
                          gender?.slug ||
                          gender?.name ||
                          gender?.label ||
                          "";
                    return (
                      <li
                        key={value || label}
                        className={`cate-item${selectedGenders.includes(value) ? " current" : ""}`}
                        onClick={() =>
                          toggleItem(
                            selectedGenders,
                            setSelectedGenders,
                            value,
                            "genders",
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          <span>{label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ── Price (from API range) ── */}
            <div className="widget-facet">
              <div className="facet-title">
                <span>Price</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div className="widget-price filter-price mb_36">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span className="title-price">Price:</span>
                  <span
                    style={{ fontSize: 13, color: "#2c3a34", fontWeight: 600 }}
                  >
                    ₹{priceMin} — ₹{priceMax}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 11,
                        color: "#aaa",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Min ₹
                    </label>
                    <input
                      type="number"
                      value={priceMin}
                      min={Number(data?.price_range?.min) || 0}
                      max={priceMax}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceMin(val);
                        emit({ priceMin: val });
                      }}
                      style={{
                        width: "100%",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontSize: 13,
                        color: "#2c3a34",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: 11,
                        color: "#aaa",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Max ₹
                    </label>
                    <input
                      type="number"
                      value={priceMax}
                      min={priceMin}
                      max={Number(data?.price_range?.max) || 9999}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceMax(val);
                        emit({ priceMax: val });
                      }}
                      style={{
                        width: "100%",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontSize: 13,
                        color: "#2c3a34",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Colors (API — hex values as circles) ── */}
            {uniqueColors.length > 0 && (
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Color</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <ul className="tf-filter-group filter-color current-scrollbar mb_36">
                  {uniqueColors.map(({ color, count }) => (
                    <li
                      key={color}
                      className="list-item d-flex gap-12 align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        toggleItem(
                          selectedColors,
                          setSelectedColors,
                          color,
                          "colors",
                        )
                      }
                    >
                      {/* Color circle */}
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: selectedColors.includes(color)
                            ? "3px solid #2c3a34"
                            : "1.5px solid #ccc",
                          flexShrink: 0,
                          display: "inline-block",
                          boxShadow:
                            color === "#ffffff"
                              ? "inset 0 0 0 1px #ddd"
                              : "none",
                        }}
                      />
                      <label className="label" style={{ cursor: "pointer" }}>
                        <span>{color}</span>&nbsp;
                        <span>({count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Sizes (API) ── */}
            {data?.sizes?.length > 0 && (
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Size</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {data.sizes.map(({ size, count }) => (
                    <li
                      key={size}
                      className="list-item d-flex gap-12 align-items-center"
                    >
                      <input
                        type="checkbox"
                        className="tf-check tf-check-size"
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onChange={() =>
                          toggleItem(
                            selectedSizes,
                            setSelectedSizes,
                            size,
                            "sizes",
                          )
                        }
                      />
                      <label htmlFor={`size-${size}`} className="label">
                        <span>{size}</span>&nbsp;
                        <span>({count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Loading state ── */}
            {!data && (
              <div
                style={{
                  padding: "24px 0",
                  textAlign: "center",
                  color: "#888",
                  fontSize: 14,
                }}
              >
                Loading filters...
              </div>
            )}

            {/* actions intentionally removed: filters update live */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
