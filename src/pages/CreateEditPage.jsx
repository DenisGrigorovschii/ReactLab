import React from 'react'
import { useParams } from 'react-router-dom'
import { useEntities } from '../context/EntitiesContext'
import EntityForm from '../components/EntityForm'

export default function CreateEditPage(){
  const { id } = useParams()
  const { getById, addEntity, updateEntity } = useEntities()
  const entity = id ? getById(id) : null

  if(id && !entity) {
    return (
      <div className="page">
        <div className="error">
          Сущность не найдена.
        </div>
      </div>
    )
  }

  const onSave = (data) => {
    if(id){
      updateEntity({ ...data, id: Number(id) })
    } else {
      addEntity(data)
    }
  }

  return (
    <div className="page">
      <h2>{id ? 'Редактирование товара' : 'Создание нового товара'}</h2>
      <EntityForm initial={entity} onSave={onSave} />
    </div>
  )
}
