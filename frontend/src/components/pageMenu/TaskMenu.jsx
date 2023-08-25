import React from "react";
import { NavLink } from "react-router-dom";

const PageMenu = (id) => {
  return (
    <div>
      <nav className="--btn-google --p --mb">
        <ul className="home-links">
          <li>
            <NavLink to={`/project/${id.id}/active`}>Aktivni</NavLink>
          </li>
          <li>
            <NavLink to={`/project/${id.id}/completed`}>Završeni</NavLink>
          </li>
          <li>
            <NavLink to={`/project/${id.id}/missing`}>Nedostaju</NavLink>
          </li>
          <li>
            <NavLink to={`/project/${id.id}/stats`}>Statistika članova</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PageMenu;
