import { showErrorMessage } from "../utils";

// export const HOST =
// "https://d29f-2401-4900-1c75-f139-2cf8-f64f-3ed3-a22f.ngrok-free.app";

// export const IMAGE_HOST = "http://localhost:3002";

export const IMAGE_HOST = "https://huehoppers.s3.amazonaws.com";
export const HOST = "https://backend.huehoppers.com";
// LOGIN
export const LOGIN = HOST + "/api" + "/users/login";

// REGISTER
export const REGISTER = HOST + "/api" + "/users/register";
export const FORGOT_PASSWORD = HOST + "/api" + "/passwords/forgot";
export const RESET_PASSWORD = HOST + "/api" + "/passwords/reset";
export const EMAIL_VERIFICATION_VERIFY =
  HOST + "/api" + "/email_verifications/verify";
export const ADDRESSES = HOST + "/api" + "/addresses";
export const PROFILE = HOST + "/api" + "/profile";
export const CHANGE_PASSWORD = HOST + "/api" + "/profile/change_password";
export const WISHLISTS = HOST + "/api" + "/wishlists";
export const NOTIFICATIONS = `${HOST}/api/notifications`;

// PRODUCTS
export const PRODUCTS = HOST + "/api" + "/products";
export const PRODUCT_FILTERS = HOST + "/api" + "/products/filters";

// Reviews
export const REVIEWS = HOST + "/api" + "/reviews";

// Collections
export const COLLECTIONS = HOST + "/api" + "/collections";

// Blogs
export const BLOGS = HOST + "/api" + "/blogs";

// Carts
export const CARTS = HOST + "/api" + "/carts";
export const ADD_ITEM_TO_CART = HOST + "/api" + "/carts/add_item";
export const UPDATE_ITEM_IN_CART = HOST + "/api" + "/carts/update_item";
export const REMOVE_ITEM_FROM_CART = HOST + "/api" + "/carts/remove_item";

// Checkout
export const DISCOUNTS = `${HOST}/api/discounts/apply`;
export const ORDERS = `${HOST}/api/orders`;
export const PAYMENTS = `${HOST}/api/payments`;

let sessionTimeoutHandled = false;

export const saveFcmToken = (fcm) => {
  localStorage.setItem("fcmToken", fcm);
};

export const getToken = () => {
  const token = localStorage.getItem("Token");
  return token;
};

export const getImageUrl = (url) => {
  const completeUrl = url?.indexOf("http") > -1 ? url : IMAGE_HOST + url;
  return completeUrl;
};

const getHeadersObject = () => {
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  };
};

const getHeadersObjectToken = () => {
  const token = getToken();
  return {
    Authorization: `${token}`,
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  };
};
export const getAuthHeaders = () => ({
  Authorization: `${getToken()}`,
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "69420",
});

export const authedFetch = async (url, method, body) => {
  const resJSON = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await returnOrThrow(resJSON);
  if (result?.status === "error") {
    throw result?.error || result?.message || "Request failed";
  }
  return result;
};

// API Wrappers
export const returnOrThrow = async (resJSON) => {
  let result;
  const status = resJSON.status;
  if (status === 401) {
    if (!sessionTimeoutHandled) {
      sessionTimeoutHandled = true;
      localStorage.removeItem("Token");
      localStorage.removeItem("userType");
      showErrorMessage("Session expired. Logging you out in a few seconds");
      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      }
    }
    throw "sessionTimeout";
  } else if (status === 404 || status >= 500) {
    throw `Something went wrong! Status: ${status}`;
  }
  try {
    result = await resJSON.json();
  } catch (err) {
    result = { error: "Something went wrong" };
  }
  if (status !== 200) {
    throw result.error;
  }
  return result;
};

export const putWrapper = async (url, body) => {
  const headers = getHeadersObject();
  const resJSON = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  });
  return resJSON;
};

export const postWrapper = async (url, body) => {
  const headers = getHeadersObject();
  const resJSON = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
  return resJSON;
};

export const getWrapper = async (url) => {
  const headers = getHeadersObject();
  const resJSON = await fetch(url, {
    method: "GET",
    headers,
  });
  return resJSON;
};

export const deleteWrapper = async (url) => {
  const headers = getHeadersObject();
  const resJSON = await fetch(url, {
    method: "DELETE",
    headers,
  });
  return resJSON;
};

export const getWrapperToken = async (url) => {
  const headers = getHeadersObjectToken();
  const resJSON = await fetch(url, {
    method: "GET",
    headers,
  });
  return resJSON;
};

export const getPincodeDetails = async (pincode) => {
  const resJSON = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`,
  );
  const result = await resJSON.json();
  const { State, District } = result[0]["PostOffice"][0];
  return { State, District };
};

export const trackEvent = (name, properties = {}) => {
  //   Amplitude.getInstance().logEvent(name, properties);
};
