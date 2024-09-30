import React, { useState } from "react";
import logoTotiDark from "./logoTotiDark.png";
import logoMobile from "./logoMobile.png";
import dashboard from "./dashboard.svg";
import equipes from "./equipes.svg";
import relatorios from "./relatorios.svg";
import ajustes from "./ajustes.svg";
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar">
      <picture>
        <Link to="/">
          <img src={logoTotiDark} alt="logoTotiDark" className="logo"/>
        </Link>
      </picture>
      <nav className="sidebar">
        <ul>
          <li>
            <NavLink
              to="/kanban/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : "inactive-link"
              }
            >
              <img src={dashboard} alt="dashboard" />
              <p>Dashboard</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/kanban/groups"
              className={({ isActive }) =>
                isActive ? "active-link" : "inactive-link"
              }
            >
              <img src={equipes} alt="equipes" />
              <p>Equipes</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kanban/reports"
              className={({ isActive }) =>
                isActive ? "active-link" : "inactive-link"
              }
            >
              <img src={relatorios} alt="relatorios" />
              <p>Relatórios</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kanban/myProfile"
              className={({ isActive }) =>
                isActive ? "active-link" : "inactive-link"
              }
            >
              <img src={ajustes} alt="ajustes" />
              <p>Ajustes</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
