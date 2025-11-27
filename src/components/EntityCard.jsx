import React from 'react'

export default function EntityCard({ item, children }){
  return (
    <div className="card">
      <div className="card-header">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} />
        ) : (
          <div style={{width:80,height:80,background:'#e2e8f0',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontSize:'12px'}}>
            Нет фото
          </div>
        )}
        <div className="card-content">
          <div className="card-title">{item.title}</div>
          <div className="card-category">{item.category}</div>
          <div className="card-price">{Math.round(item.price || 0)} MDL</div>
        </div>
      </div>
      {children && <div className="card-actions">{children}</div>}
    </div>
  )
}
