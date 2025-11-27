import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntities } from '../context/EntitiesContext'
import EntityCard from '../components/EntityCard'

export default function ListPage(){
  const { entities, loading, error, deleteEntity, getById } = useEntities()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [viewEntityId, setViewEntityId] = useState(null)
  const navigate = useNavigate()

  const categories = useMemo(()=> {
    const s = new Set(entities.map(e=>e.category).filter(Boolean))
    return Array.from(s).sort()
  }, [entities])

  const maxPrice = useMemo(() => {
    if(entities.length === 0) return 500000
    return Math.max(...entities.map(e => e.price || 0), 500000)
  }, [entities])

  const [priceRange, setPriceRange] = useState([0, 500000])

  // Обновляем диапазон цен при загрузке данных
  useEffect(() => {
    if(maxPrice > 0 && priceRange[1] === 500000) {
      setPriceRange([0, maxPrice])
    }
  }, [maxPrice])

  const filtered = useMemo(() => {
    let out = entities
    if(q) {
      const t = q.toLowerCase()
      out = out.filter(e => 
        (e.title||'').toLowerCase().includes(t) || 
        (e.description||'').toLowerCase().includes(t)
      )
    }
    if(category) out = out.filter(e => e.category === category)
    out = out.filter(e => (e.price||0) >= priceRange[0] && (e.price||0) <= priceRange[1])
    if(sort === 'price_asc') out = out.slice().sort((a,b)=>a.price-b.price)
    if(sort === 'price_desc') out = out.slice().sort((a,b)=>b.price-a.price)
    if(sort === 'title_asc') out = out.slice().sort((a,b)=>(a.title||'').localeCompare(b.title||''))
    if(sort === 'title_desc') out = out.slice().sort((a,b)=>(b.title||'').localeCompare(a.title||''))
    return out
  }, [entities, q, category, priceRange, sort])

  const viewEntity = viewEntityId ? getById(viewEntityId) : null

  const handleDelete = (id) => {
    if(window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      deleteEntity(id)
      if(viewEntityId === id) {
        setViewEntityId(null)
      }
    }
  }

  return (
    <div>
      <div className="filters">
        <input 
          type="text"
          placeholder="Поиск по названию или описанию..." 
          value={q} 
          onChange={e=>setQ(e.target.value)}
        />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Сортировка</option>
          <option value="price_asc">По цене ↑</option>
          <option value="price_desc">По цене ↓</option>
          <option value="title_asc">По названию А-Я</option>
          <option value="title_desc">По названию Я-А</option>
        </select>
        <div className="price-range">
          <input 
            type="number" 
            value={priceRange[0]} 
            onChange={e=>setPriceRange([Number(e.target.value||0), priceRange[1]])}
            min="0"
            max={maxPrice}
          />
          <span>—</span>
          <input 
            type="number" 
            value={priceRange[1]} 
            onChange={e=>setPriceRange([priceRange[0], Number(e.target.value||maxPrice)])}
            min={priceRange[0]}
            max={maxPrice}
          />
        </div>
        <button 
          className="btn-outline btn-sm"
          onClick={()=>{ 
            setQ(''); 
            setCategory(''); 
            setPriceRange([0, maxPrice]); 
            setSort('') 
          }}
        >
          Сбросить фильтры
        </button>
        <div className="results-count">Найдено: {filtered.length}</div>
      </div>

      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">Ошибка: {error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">Ничего не найдено. Попробуйте изменить параметры поиска.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid">
          {filtered.map(item => (
            <EntityCard key={item.id} item={item}>
              <button 
                className="btn-primary btn-sm"
                onClick={()=>setViewEntityId(item.id)}
              >
                Просмотр
              </button>
              <button 
                className="btn-secondary btn-sm"
                onClick={()=>navigate('/edit/'+item.id)}
              >
                Редактировать
              </button>
              <button 
                className="btn-danger btn-sm"
                onClick={()=>handleDelete(item.id)}
              >
                Удалить
              </button>
            </EntityCard>
          ))}
        </div>
      )}

      {viewEntity && (
        <div className="modal" onClick={() => setViewEntityId(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>{viewEntity.title}</h2>
            {viewEntity.thumbnail && (
              <img src={viewEntity.thumbnail} alt={viewEntity.title} style={{maxWidth:'100%',borderRadius:'8px',marginBottom:'16px'}} />
            )}
            <div className="detail-item">
              <div className="detail-label">Описание</div>
              <div className="detail-value">{viewEntity.description || 'Нет описания'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Категория</div>
              <div className="detail-value">{viewEntity.category || 'Не указана'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Цена</div>
              <div className="detail-value price-value">{Math.round(viewEntity.price || 0)} MDL</div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-primary"
                onClick={() => {
                  setViewEntityId(null)
                  navigate('/edit/' + viewEntity.id)
                }}
              >
                Редактировать
              </button>
              <button 
                className="btn-danger"
                onClick={() => {
                  handleDelete(viewEntity.id)
                  setViewEntityId(null)
                }}
              >
                Удалить
              </button>
              <button 
                className="btn-outline"
                onClick={() => setViewEntityId(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
