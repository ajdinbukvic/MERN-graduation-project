import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import authService from "../redux/features/auth/authService";

const useRedirectLoggedOutUser = (path) => {
  const navigate = useNavigate();

  useEffect(() => {
    let isLoggedIn;
    const redirectLoggedOutUser = async () => {
      try {
        isLoggedIn = await authService.getLoginStatus();
        // console.log(isLoggedIn);
      } catch (error) {
        console.log(error.message);
      }

      if (!isLoggedIn) {
        toast.info("Sesija je istekla, molimo da se prijavite ponovo.");
        navigate(path);
        return;
      }
    };
    redirectLoggedOutUser();
  }, [navigate, path]);
};

export default useRedirectLoggedOutUser;
