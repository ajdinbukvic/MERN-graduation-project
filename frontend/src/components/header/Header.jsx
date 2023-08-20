import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.scss";
import { BiTask } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logout, RESET } from "../../redux/features/auth/authSlice";
import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";
import { FaUserCircle } from "react-icons/fa";
import { UserName } from "../../pages/profile/Profile";
import { googleLogout } from "@react-oauth/google";

const activeLink = ({ isActive }) => (isActive ? `${"active"}` : "");

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goHome = () => {
    navigate("/");
  };

  const logoutUser = async () => {
    await dispatch(RESET());
    await dispatch(logout());
    googleLogout();
    navigate("/login");
  };

  return (
    <header className="header">
      <nav>
        <div className="logo" onClick={goHome}>
          <BiTask size={35} />
          <span>DiplomskiApp</span>
        </div>

        <ul className="home-links">
          <ShowOnLogin>
            <li className="--flex-center">
              <FaUserCircle size={20} />
              &nbsp;
              <UserName />
            </li>
          </ShowOnLogin>
          <ShowOnLogout>
            <li>
              <button className="--btn --btn-danger">
                <Link to="/register">Registracija</Link>
              </button>
            </li>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/login">Prijava</Link>
              </button>
            </li>
          </ShowOnLogout>

          <ShowOnLogin>
            <li>
              <NavLink to="/profile" className={activeLink}>
                Profil
              </NavLink>
            </li>

            <li>
              <button className="--btn --btn-danger" onClick={logoutUser}>
                Odjava
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
