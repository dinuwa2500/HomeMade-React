import React from 'react';
import './style.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

const ProductZoom = () => {
  return (
    <>
      <div className="flex gap-4">
        {/*<div className="slider">
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            modules={[Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="item">
                <img
                  src="https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg"
                  alt=""
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>*/}

        <InnerImageZoom
          zoomType="hover"
          zoomScale={1}
          src="https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg"
        />
      </div>
    </>
  );
};

export default ProductZoom;
