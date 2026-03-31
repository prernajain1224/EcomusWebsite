import toast from "react-hot-toast";

export const OK = "ok";

export const showErrorMessage = (message) => {
  toast.error(message, {
    duration: 4000,
  });
};

export const showSuccessMessage = (message) => {
  toast.success(message, {
    duration: 3000,
  });
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};
