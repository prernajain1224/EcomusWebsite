import { BLOGS } from "./utils";
import { getWrapper, returnOrThrow } from "./utils";

export const getBlogs = async (page = 1) => {
  const resJSON = await getWrapper(`${BLOGS}?page=${page}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

export const getBlogDetails = async (slug) => {
  const resJSON = await getWrapper(`${BLOGS}/${slug}`);
  const result = await returnOrThrow(resJSON);
  return result;
};
