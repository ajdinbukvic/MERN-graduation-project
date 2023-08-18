import React, { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { FaTimes } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import { validateEmail } from "../../redux/features/auth/authService";
import { register, RESET } from "../../redux/features/auth/authSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, passwordConfirm } = formData;

  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);
  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;

  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    }
    return timesIcon;
  };

  useEffect(() => {
    // Check Lower and Uppercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUCase(true);
    } else {
      setUCase(false);
    }
    // Check For Numbers
    if (password.match(/([0-9])/)) {
      setNum(true);
    } else {
      setNum(false);
    }
    // Check For Special char
    if (password.match(/([!,%,&,@,#,$,^,*,+,?,_,~])/)) {
      setSChar(true);
    } else {
      setSChar(false);
    }
    // Check if password up to 8
    if (password.length > 7) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Sva polja su obavezna.");
    }
    if (password.length < 8) {
      return toast.error("Lozinka mora biti duga minimalno 8 karaktera.");
    }
    if (!validateEmail(email)) {
      return toast.error("Email adresa nije u validnom formatu.");
    }
    if (password !== passwordConfirm) {
      return toast.error("Lozinke se ne podudaraju.");
    }

    if (!uCase || !num || !sChar || !passLength) {
      return toast.error("Nisu ispunjeni svi uslovi za jaku lozinku.");
    }

    const userData = {
      name,
      email,
      password,
      passwordConfirm,
    };
    console.log(userData);

    await dispatch(register(userData));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }

    dispatch(RESET());
  }, [isSuccess, message, navigate, dispatch]);

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Registracija</h2>

          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Ime i prezime"
              required
              name="name"
              value={name}
              onChange={handleInputChange}
            />
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
            <PasswordInput
              placeholder="Potvrda lozinke"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleInputChange}
              onPaste={(e) => {
                e.preventDefault();
                toast.error("Ne možete zalijepiti tekst u ovo polje.");
                return false;
              }}
            />

            {/* Password Strength Indicator */}
            <Card cardClass={styles.group}>
              {/* List  */}
              <ul className="form-list">
                <li>
                  <span className={styles.indicator}>
                    {/* {uCase ? checkIcon : timesIcon} */}
                    {switchIcon(uCase)}
                    &nbsp; Mala i velika slova
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)}
                    &nbsp; Brojevi (0-9)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(sChar)}
                    &nbsp; Specijalni znakovi (!@#$%^&*)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)}
                    &nbsp; Lozinka minimalno 8 karaktera
                  </span>
                </li>
              </ul>
            </Card>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Registruj se
            </button>
          </form>

          <span className={styles.register}>
            <Link to="/">Početna</Link>
            <p> &nbsp; Već imate profil? &nbsp;</p>
            <Link to="/login">Prijava</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
