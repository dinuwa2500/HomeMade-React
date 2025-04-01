import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import ProductItems from '../ProductItems';

const ProductsSlider = (props) => {
  return (
    <div className="ProductSlider py-5">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
        <SwiperSlide>
          <ProductItems />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
