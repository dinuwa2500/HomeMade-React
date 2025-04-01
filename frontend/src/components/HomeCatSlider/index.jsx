import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import assets from '../../assets/assets';

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider">
      <div className="container items-center flex justify-center p-5 w-full">
        <Swiper
          slidesPerView={5}
          spaceBetween={120}
          modules={[Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={assets.batik} className="w-[65px] h-[65px]" alt="Batik" />
            <h3 className="font-[500] text-[16px]">Batik Wear</h3>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={assets.bamboo}
              className="w-[65px] h-[65px] mx-7"
              alt="Bamboo"
            />
            <h3 className="font-[500] text-[16px]">Bamboo Products</h3>
          </SwiperSlide>

          <SwiperSlide>
            <img src={assets.bowl} className="w-[65px] h-[65px]" alt="Bowls" />
            <h3 className="mx-3 font-[500] text-[16px]">Bowls</h3>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={assets.shopping}
              className="w-[65px] h-[65px]"
              alt="Bags"
            />
            <h3 className="mx-3 font-[500] text-[16px]">Bags</h3>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={assets.carpet}
              className="w-[65px] h-[65px]"
              alt="Carpets"
            />
            <h3 className="font-[500] text-[16px]">Carpets</h3>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
