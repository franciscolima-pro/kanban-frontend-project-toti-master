import React, { useState, useEffect } from "react";
import LoaderDashboard from "../loadings/LoaderDashboard.jsx";

export default function Boards() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {loading ? (
        <LoaderDashboard />
      ) : (
        <div>
          <h1>DashBoard</h1>
          <p>Esta é a página de Kanban!</p>
        </div>
      )}
    </div>
  );
}
