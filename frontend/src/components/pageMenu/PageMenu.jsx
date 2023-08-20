import React from "react";
import { NavLink } from "react-router-dom";
import { AdminAuthorLink } from "../protect/HiddenLink";

const PageMenu = () => {
  return (
    <div>
      <nav className="--btn-google --p --mb">
        <ul className="home-links">
          <li>
            <NavLink to="/profile">Profil</NavLink>
          </li>
          <li>
            <NavLink to="/changePassword">Promjena lozinke</NavLink>
          </li>
          <li>
            <NavLink to="/twoFactorAuth">Dvofaktorska autentifikacija</NavLink>
          </li>
          <AdminAuthorLink>
            <li>
              <NavLink to="/users">Korisnici</NavLink>
            </li>
          </AdminAuthorLink>
        </ul>
      </nav>
    </div>
  );
};

export default PageMenu;
