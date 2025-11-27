import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ListPage from './pages/ListPage'
import EntityPage from './pages/EntityPage'
import CreateEditPage from './pages/CreateEditPage'

export default function App(){
  return (
    <div className="container">
      <header>
        <h1><Link to="/">🛍️ Каталог товаров</Link></h1>
        <nav className="controls">
          <Link to="/create">
            <button className="btn-primary">+ Создать товар</button>
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<ListPage/>} />
        <Route path="/entity/:id" element={<EntityPage/>} />
        <Route path="/create" element={<CreateEditPage/>} />
        <Route path="/edit/:id" element={<CreateEditPage/>} />
      </Routes>
    </div>
  )
}
