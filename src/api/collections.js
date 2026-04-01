import { COLLECTIONS, getWrapper, returnOrThrow } from "./utils";

export const getCollections = async (page = 1) => {
  const resJSON = await getWrapper(`${COLLECTIONS}?page=${page}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

export const getCollectionDetails = async (slug) => {
  const resJSON = await getWrapper(`${COLLECTIONS}/${slug}`);
  const result = await returnOrThrow(resJSON);
  return result;
};

export const getFeaturedCollections = async () => {
  const resJSON = await getWrapper(`${COLLECTIONS}?featured=true`);
  return returnOrThrow(resJSON);
};
