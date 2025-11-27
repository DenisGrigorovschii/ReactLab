import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEntities } from '../context/EntitiesContext'

export default function EntityPage(){
  const { id } = useParams()
  const { getById, deleteEntity } = useEntities()
  const entity = getById(id)
  const navigate = useNavigate()
  const [showDelConfirm, setShowDelConfirm] = useState(false)

  if(!entity) {
    return (
      <div className="page">
        <div className="error">
          Сущность не найдена.
          <div style={{marginTop:'16px'}}>
            <button className="btn-primary" onClick={() => navigate('/')}>
              На главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    deleteEntity(entity.id)
    navigate('/')
  }

  return (
    <div className="entity-details">
      <h2>{entity.title}</h2>
      {entity.thumbnail && (
        <img src={entity.thumbnail} alt={entity.title} />
      )}
      <div className="detail-item">
        <div className="detail-label">Описание</div>
        <div className="detail-value">{entity.description || 'Нет описания'}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Категория</div>
        <div className="detail-value">{entity.category || 'Не указана'}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Цена</div>
        <div className="detail-value price-value">{Math.round(entity.price || 0)} MDL</div>
      </div>
      <div className="page-actions">
        <button 
          className="btn-primary"
          onClick={() => navigate('/edit/' + entity.id)}
        >
          Редактировать
        </button>
        <button 
          className="btn-danger"
          onClick={() => setShowDelConfirm(true)}
        >
          Удалить
        </button>
        <button 
          className="btn-outline"
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </div>

      {showDelConfirm && (
        <div className="modal" onClick={() => setShowDelConfirm(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Подтверждение удаления</h2>
            <p>Вы уверены, что хотите удалить элемент <strong>"{entity.title}"</strong>?</p>
            <p style={{color:'var(--danger-color)',fontSize:'14px'}}>Это действие нельзя отменить.</p>
            <div className="modal-actions">
              <button 
                className="btn-danger"
                onClick={handleDelete}
              >
                Да, удалить
              </button>
              <button 
                className="btn-outline"
                onClick={() => setShowDelConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
