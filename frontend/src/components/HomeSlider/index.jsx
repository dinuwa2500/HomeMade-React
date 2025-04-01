import React from 'react'
import { Navigation ,Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import assets from '../../assets/assets';

const HomeSlider = () => {
    return (
<div className='homeSLider ' >
  <div className='container  py-3'>
   
  <Swiper
  spaceBetween={30}  
   navigation={true} 
   autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
   modules={[Autoplay , Navigation ]} 
   className="SwiperHome">
      <SwiperSlide>
        <div className='items rounded-[25px] overflow-hidden'>
        <img src='https://api.spicezgold.com/download/file_1734524985581_NewProject(11).jpg' className='w-full h-[375px]' alt="" />
        </div>
        </SwiperSlide>

      <SwiperSlide>
          <div className='items rounded-[20px] overflow-hidden'>
        <img src='https://api.spicezgold.com/download/file_1734524971122_NewProject(8).jpg' className='w-full h-[375px]' alt="" />
        </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='items rounded-[20px] overflow-hidden'>
        <img src={assets.banner3} className='w-full h-[375px]' alt="" />
        </div>
        </SwiperSlide>
    </Swiper>
   </div>
  </div>
    )
    };

export default HomeSlider
