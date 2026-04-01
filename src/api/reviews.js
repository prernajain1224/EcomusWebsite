import { authedFetch, getWrapper, returnOrThrow, REVIEWS } from "./utils";

export const getRecentReviews = async (limit = 3) => {
  const resJSON = await getWrapper(`${REVIEWS}?limit=${limit}`);
  return returnOrThrow(resJSON);
};

export const createReview = (productSlug, data) =>
  authedFetch(REVIEWS, "POST", {
    product_slug: productSlug,
    rating: data.rating,
    comment: data.comment,
  });
