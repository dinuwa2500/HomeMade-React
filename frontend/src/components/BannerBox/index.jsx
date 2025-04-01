import React from 'react'
import assets from '../../assets/assets.js'
const BannerBox = (props) => {
  return (
    <div className='box bannerBox overflow-hidden rounded-lg'>
        <img src={props.img} alt='image'/>
        
    </div>
    
  )
}

export default BannerBox
