import {
  EMAIL_VERIFICATION_VERIFY,
  FORGOT_PASSWORD,
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  getWrapper,
  returnOrThrow,
} from "./utils";

export const loginUser = async ({ username, password, guest_cart_id }) => {
  const resJSON = await fetch(LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      ...(guest_cart_id ? { guest_cart_id } : {}),
    }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

export const registerUser = async ({
  name,
  email,
  mobile,
  password,
  guest_cart_id,
}) => {
  const resJSON = await fetch(REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      mobile,
      password,
      ...(guest_cart_id ? { guest_cart_id } : {}),
    }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

export const forgotPassword = async ({ email }) => {
  const resJSON = await fetch(FORGOT_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

export const resetPassword = async ({ token, password }) => {
  const resJSON = await fetch(RESET_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });
  const result = await returnOrThrow(resJSON);
  return result;
};

export const verifyEmailToken = async (token) => {
  const resJSON = await getWrapper(
    `${EMAIL_VERIFICATION_VERIFY}?token=${encodeURIComponent(token)}`,
  );
  const result = await returnOrThrow(resJSON);
  return result;
};
