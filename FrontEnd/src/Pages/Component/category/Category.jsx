import React from 'react'
import "./Category.css";

const Category = ({path,name}) => {
  return (
    <div className='category'>
      <div>
        <img src={path} alt={name} />
      </div>
      <p>{name}</p>
    </div>
  )
}

export default Category