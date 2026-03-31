import { authedFetch, REVIEWS } from "./utils";

export const createReview = (productSlug, data) =>
  authedFetch(REVIEWS, "POST", {
    product_slug: productSlug,
    rating: data.rating,
    comment: data.comment,
  });
