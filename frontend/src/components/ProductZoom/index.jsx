import React from 'react';
import './style.css';
import InnerImageZoom from 'react-inner-image-zoom';

const ProductZoom = ({ images = [] }) => {
  // fallback image
  const fallback = [
    'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
  ];
  const imgList = images && images.length > 0 ? images : fallback;

  return (
    <div className="flex items-center justify-center">
      <InnerImageZoom
        zoomType="hover"
        zoomScale={1}
        src={imgList[0]}
        alt="Product Image"
        className="rounded-md border w-[350px] h-[350px] object-cover"
      />
    </div>
  );
};

export default ProductZoom;
