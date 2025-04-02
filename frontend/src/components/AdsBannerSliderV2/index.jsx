import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import assets from '../../assets/assets.js';

const AdsBannerSlider = () => {
  return (
    <div className="slider flex justify-center items-center w-full">
      <div className="container py-5 max-w-6xl mx-auto">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          modules={[Navigation]}
          className="w-full"
        >
          {[assets.ad1, assets.ad2, assets.ad3].map((ad, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center w-full h-full">
                <div className="box bannerBox overflow-hidden rounded-lg">
                  <img src={ad} alt="" className="w-full h-auto" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AdsBannerSlider;
