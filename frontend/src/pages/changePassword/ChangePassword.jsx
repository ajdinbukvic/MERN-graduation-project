import React, { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import PageMenu from "../../components/pageMenu/PageMenu";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ChangePassword.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  logout,
  RESET,
} from "../../redux/features/auth/authSlice";
import { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
const initialState = {
  currentPassword: "",
  password: "",
  passwordConfirm: "",
};

const ChangePassword = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const { currentPassword, password, passwordConfirm } = formData;
  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return toast.error("Nove lozinke se moraju podudarati.");
    }

    const userData = {
      currentPassword,
      password,
      passwordConfirm,
    };

    await dispatch(changePassword(userData));
    //await dispatch(logout());
  };

  useEffect(() => {
    dispatch(RESET());
    if (isSuccess && message.includes("Password changed successfully!")) {
      navigate("/login");
      dispatch(logout());
    }
  }, [isSuccess, message, navigate, dispatch]);

  return (
    <>
      <div>
        <section>
          <div className="container">
            <PageMenu />
            <div className="--flex-center change-password">
              <Card cardClass={"card"}>
                <form onSubmit={updatePassword}>
                  <p>
                    <label>Trenutna lozinka:</label>
                    <PasswordInput
                      placeholder="Trenutna lozinka"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>Nova lozinka:</label>
                    <PasswordInput
                      placeholder="Nova lozinka"
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>Potvrda nove lozinke:</label>
                    <PasswordInput
                      placeholder="Potvrda nove lozinke"
                      name="passwordConfirm"
                      value={passwordConfirm}
                      onChange={handleInputChange}
                      onPaste={(e) => {
                        e.preventDefault();
                        toast.error("Ne možete zalijepiti tekst u ovo polje.");
                        return false;
                      }}
                    />
                  </p>
                  {isLoading ? (
                    <SpinnerImg />
                  ) : (
                    <button className="--btn --btn-block --btn-danger">
                      Ažuriraj lozinku
                    </button>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChangePassword;
