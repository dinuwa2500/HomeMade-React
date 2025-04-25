import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import ProductItems from '../ProductItems';

const ProductsSlider = (props) => {
  const { products = [], items = 5 } = props;
  return (
    <div className="ProductSlider py-3">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {products.length > 0 ? (
          products.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <ProductItems product={product} />
            </SwiperSlide>
          ))
        ) : (
          // fallback: show empty slides or skeletons
          Array.from({ length: items }).map((_, idx) => (
            <SwiperSlide key={idx}>
              <ProductItems />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
