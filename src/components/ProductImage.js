import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function ProductImage({ images }) {
  const [mainImg, setMainImg] = useState(images[0]?.node || {
    transformedSrc: "https://via.placeholder.com/150x150",
    altText: 'productImage'
  });
  const ref = useRef();

  function scroll(scrollOffset) {
    ref.current.scrollLeft += scrollOffset;
  }

  return (
    <div className="w-full md:auto h-auto border border-palette-lighter bg-white rounded shadow-lg ">
      <div className="relative h-96">
        <img
          loading="lazy"
          src={mainImg.transformedSrc}
          alt={mainImg.altText}
          className="w-full h-96 object-contain relative transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
      <div className="relative flex border-t border-palette-lighter ">
        <button
          aria-label="left-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute left-0 z-10 opacity-75 "
          onClick={() => scroll(-300)}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="w-3 mx-1 text-palette-primary"
          />
        </button>
        <div
          ref={ref}
          style={{ scrollBehavior: "smooth" }}
          className="flex  w-full overflow-auto border-t border-palette-lighter "
        >
          {images.map((imgItem, index) => (
            <button
              key={index}
              className="relative w-40 h-32 flex-shrink-0 rounded-sm "
              onClick={() => setMainImg(imgItem.node)}
            >
              <img
                loading="lazy"
                src={imgItem.node.transformedSrc}
                alt={imgItem.node.altText}
                className="w-full h-32 object-contain"
              />
            </button>
          ))}
        </div>
        <button
          aria-label="right-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute right-0 z-10 opacity-75"
          onClick={() => scroll(300)}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            className="w-3 mx-1 text-palette-primary"
          />
        </button>
      </div>
    </div>
  );
}

export default ProductImage;
