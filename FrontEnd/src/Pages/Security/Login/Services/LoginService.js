import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "../../../../Shared/Ajax/JavaAjax";

async function checkCredentials(user) {
    const response = await axios.post(
        "auth/login",
        {
            username: user.UserName,
            password: user.Password
        },
        {
            withCredentials: true // REQUIRED for HttpOnly cookies
        }
    );

    return response.data;
}

const showLoginModal = () => {
  const modalEl = document.getElementById("loginModal");
  if (!modalEl) return;

  const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
  modal.show();
};


export { checkCredentials ,showLoginModal};