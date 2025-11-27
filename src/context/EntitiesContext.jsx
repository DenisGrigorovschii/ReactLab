import React, { createContext, useState, useEffect, useContext } from 'react'

const EntitiesContext = createContext(null)

export function EntitiesProvider({ children }){
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEntities()
  }, [])

  const fetchEntities = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('https://dummyjson.com/products?limit=50')
      const data = await res.json()
      // dummyjson: data.products
      const products = data.products || data
      // Увеличиваем цены в 5 раз
      const productsWithUpdatedPrices = Array.isArray(products)
        ? products.map(p => ({ ...p, price: Math.round((p.price || 0) * 5) }))
        : products
      setEntities(productsWithUpdatedPrices)
    } catch(err){
      setError('Ошибка загрузки')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getById = (id) => entities.find(it => Number(it.id) === Number(id))
  const addEntity = (newEntity) => {
    // ensure unique id (local)
    const nextId = Math.max(0, ...entities.map(e=>e.id||0)) + 1
    setEntities(prev => [...prev, { ...newEntity, id: nextId }])
  }
  const updateEntity = (upd) => {
    setEntities(prev => prev.map(it => Number(it.id) === Number(upd.id) ? upd : it))
  }
  const deleteEntity = (id) => {
    setEntities(prev => prev.filter(it => Number(it.id) !== Number(id)))
  }

  return (
    <EntitiesContext.Provider value={{
      entities, loading, error,
      fetchEntities, getById, addEntity, updateEntity, deleteEntity
    }}>
      {children}
    </EntitiesContext.Provider>
  )
}

export function useEntities(){ return useContext(EntitiesContext) }
