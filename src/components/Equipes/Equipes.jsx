import React, { useState, useEffect } from 'react';
import LoaderEquipes from '../loadings/LoaderEquipes.jsx';

export default function Equipes() {
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
        <LoaderEquipes />
      ) : (
        <div>
          <h1>Equipes</h1>
          <p>Informações sobre as equipes serão exibidas aqui.</p>
        </div>
      )}
    </div>
  )
}
