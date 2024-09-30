import React, { useState, useEffect } from 'react';
import LoaderWelcome from './loadings/LoaderWelcome';
import welcomePicture from '../assets/welcomePicture.svg'

export default function Welcome() {
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
        <LoaderWelcome />
      ) : (
        <>
        <div className='welcome'>
          <img src={welcomePicture} alt="" />
          <div>
            <h1>Bem-vindo todo mundo!</h1>
            <p>Escolha uma das opções no menu à esquerda para começar.</p>
          </div>
        </div>
        </>
      )}
    </div>
  )
}
