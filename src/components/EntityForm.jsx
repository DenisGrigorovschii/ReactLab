import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EntityForm({ initial, onSave }){
  const navigate = useNavigate()
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial?.price ? Math.round(initial.price) : 0)
  const [category, setCategory] = useState(initial?.category || '')
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || '')

  const submit = (e) => {
    e.preventDefault()
    if(!title.trim()) {
      alert('Укажите название')
      return
    }
    if(price < 0) {
      alert('Цена не может быть отрицательной')
      return
    }
    onSave({ title: title.trim(), description: description.trim(), price: Math.round(Number(price) || 0), category: category.trim(), thumbnail: thumbnail.trim() })
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Название *</label>
        <input 
          placeholder="Введите название" 
          value={title} 
          onChange={e=>setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Описание</label>
        <textarea 
          placeholder="Введите описание" 
          value={description} 
          onChange={e=>setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Цена *</label>
        <input 
          type="number" 
          placeholder="0" 
          value={price} 
          onChange={e=>setPrice(Math.round(Number(e.target.value) || 0))}
          min="0"
          step="1"
          required
        />
      </div>
      <div>
        <label>Категория</label>
        <input 
          placeholder="Введите категорию" 
          value={category} 
          onChange={e=>setCategory(e.target.value)}
        />
      </div>
      <div>
        <label>URL изображения</label>
        <input 
          placeholder="https://example.com/image.jpg" 
          value={thumbnail} 
          onChange={e=>setThumbnail(e.target.value)}
        />
      </div>
      {thumbnail && (
        <div>
          <label>Предпросмотр изображения</label>
          <img 
            src={thumbnail} 
            alt="Preview" 
            style={{maxWidth:'200px',borderRadius:'8px',marginTop:'8px',border:'1px solid #e2e8f0'}}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initial ? 'Сохранить изменения' : 'Создать'}
        </button>
        <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
          Отмена
        </button>
      </div>
    </form>
  )
}
