import React, { useState, useEffect } from 'react';
import LoaderRelatorios from '../loadings/LoaderRelatorios.jsx';
import './Relatorios.css'

export default function Relatorios() {
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
        <LoaderRelatorios/>):
        (
          <div>
            <h1>Relatórios</h1>
            <p>Esta é a página de Relatórios!</p>
          </div>
        )}
    </div>
  )
}