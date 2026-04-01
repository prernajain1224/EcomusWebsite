import { PRODUCTS, PRODUCT_FILTERS, getWrapper, returnOrThrow } from "./utils";

export const getProducts = async (page = 1, filters = {}) => {
  console.log("Fetching products with filters:", filters, "and page:", page);
  const params = new URLSearchParams({ page });

  if (filters.sort) params.append("sort", filters.sort);
  if (filters.query) params.append("query", filters.query);
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.categories) params.append("categories", filters.categories);
  if (filters.product_type) params.append("product_type", filters.product_type);
  if (filters.gender) params.append("gender", filters.gender);
  if (filters.sizes) params.append("sizes", filters.sizes);
  if (filters.colors) params.append("colors", filters.colors);
  if (filters.collection_id)
    params.append("collection_id", filters.collection_id);
  if (filters.price_min) params.append("price_min", filters.price_min);
  if (filters.price_max) params.append("price_max", filters.price_max);

  const resJSON = await getWrapper(`${PRODUCTS}?${params.toString()}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

export const getProductCounts = async () => {
  const resJSON = await getWrapper(`${PRODUCTS}/counts`);
  return returnOrThrow(resJSON);
};

export const getProductDetails = async (productSlug) => {
  const resJSON = await getWrapper(`${PRODUCTS}/${productSlug}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

export const getFilters = async (filters = {}) => {
  const resJSON = await getWrapper(
    `${PRODUCT_FILTERS}?${new URLSearchParams(filters).toString()}`,
  );
  const result = await returnOrThrow(resJSON);
  return result;
};
