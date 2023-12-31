import React, { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { FaGoogle } from "react-icons/fa";
import Loader from "../../components/loader/Loader";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { validateEmail } from "../../redux/features/auth/authService";
import {
  login,
  loginWithGoogle,
  RESET,
} from "../../redux/features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { email, password } = formData;

  const { isLoggedIn, isLoading, isSuccess, isError, twoFactor, message } =
    useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Sva polja su obavezna.");
    }

    if (!validateEmail(email)) {
      return toast.error("Email adresa nije u validnom formatu.");
    }

    const userData = {
      email,
      password,
    };
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isLoggedIn && isSuccess) {
      navigate("/");
    }

    if (isError && twoFactor) {
      navigate(`/loginWithCode/${email}`);
    }

    if (isError && twoFactor && message.includes("@")) {
      navigate(`/loginWithCode/${message}`);
    }

    dispatch(RESET());
  }, [
    isSuccess,
    isLoggedIn,
    isError,
    twoFactor,
    email,
    navigate,
    dispatch,
    message,
  ]);

  const googleLogin = async (credentialResponse) => {
    await dispatch(
      loginWithGoogle({ userToken: credentialResponse.credential })
    );
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2>Prijava</h2>
          <div className="--flex-center">
            <GoogleLogin
              onSuccess={googleLogin}
              onError={() => {
                console.log("Prijava neuspješna");
                toast.error("Prijava neuspješna");
              }}
            />
          </div>

          {/* <button className="--btn --btn-google --btn-block">
            <FaGoogle color="#fff" /> Login With Google
          </button> */}

          <br />
          <p className="--text-center --fw-bold">ili</p>
          <form onSubmit={loginUser}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <PasswordInput
              placeholder="Lozinka"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {/* <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            /> */}
            <button type="submit" className="--btn --btn-primary --btn-block">
              Prijavi se
            </button>
          </form>
          <Link to="/forgotPassword">Zaboravljena lozinka?</Link>
          <span className={styles.register}>
            <Link to="/">Početna</Link>
            <p>&nbsp; Nemate profil? &nbsp;</p>
            <Link to="/register">Registracija</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
