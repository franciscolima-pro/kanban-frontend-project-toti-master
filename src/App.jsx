import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Boards from "./components/Boards/Boards.jsx";
import Equipes from "./components//Equipes/Equipes.jsx";
import Relatorios from "./components/Relatorios/Relatorios.jsx";
import Ajustes from "./components/Ajustes/Ajustes.jsx";
import Header from "./components/Header/Header.jsx";
import Welcome from "./components/Welcome.jsx";

function App() {
  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/kanban/dashboard" element={<Boards />} />
            <Route path="/kanban/groups" element={<Equipes />} />
            <Route path="/kanban/reports" element={<Relatorios />} />
            <Route path="/kanban/myProfile" element={<Ajustes/>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
