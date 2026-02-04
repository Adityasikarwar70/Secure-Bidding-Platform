import toast from "react-hot-toast";

export const successToast = (message) =>
  toast.success(message, {
    style: {
      border: "1px solid #081c15",
      padding: "16px",
      color: "#2d6a4f",
    },
    iconTheme: {
      primary: "#74c69d",
      secondary: "#d8f3dc",
    },
  });

  export const errorToast = (message) =>
  toast.error(message, {
    style: {
      border: "1px solid #ff130f",
      padding: "16px",
      color: "#eb2929",
    },
    iconTheme: {
      primary: "#b1271a",
      secondary: "#FFFAEE",
    },
  });