import React, { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { GrInsecure } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateOTP, RESET } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

const LoginWithCode = () => {
  const [token, setToken] = useState("");
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, isLoading, isSuccess } = useSelector(
    (state) => state.auth
  );

  const loginUserWithCode = async (e) => {
    e.preventDefault();
    if (token === "") {
      return toast.error("Molimo unesite kod za nastavak.");
    }
    if (token.length !== 6) {
      return toast.error("Kod mora biti dug 6 karaktera.");
    }

    await dispatch(validateOTP({ token, email }));
    await dispatch(RESET());
  };

  useEffect(() => {
    if (isLoggedIn && isSuccess) {
      navigate("/");
    }
    dispatch(RESET());
  }, [isSuccess, isLoggedIn, navigate, dispatch]);

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <GrInsecure size={35} color="#999" />
          </div>
          <h2>Unesite 2FA kod</h2>

          <form onSubmit={loginUserWithCode}>
            <input
              type="text"
              placeholder="TOTP kod"
              required
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Nastavi na profil
            </button>
            <span className="--flex-center">
              Provjerite vašu 2FA aplikaciju za pristup TOTP kodu
            </span>
            <div className={styles.links}>
              <p>
                <Link to="/">- Početna</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginWithCode;
