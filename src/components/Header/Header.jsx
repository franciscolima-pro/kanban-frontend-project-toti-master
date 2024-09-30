import React from 'react'
import userTest from './userTest.png'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <>
      <header>
        <h1>Meu Kanban!</h1>
        <Link to="/kanban/myProfile">
          <img src={userTest} alt="userTest"/>
        </Link>
      </header>
      <hr/>
    </>
  )
}
