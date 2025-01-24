"use client";

import Image from "next/image";
import "./Hero.css";
import { useEffect, useState } from "react";

export default function HeroCarouselImg(props) {
  const [carouselSizeWidth, setCarouselSizeWidth] = useState(0);
  const [carouselSizeHeight, setCarouselSizeHeight] = useState(0);
  useEffect(() => {
    setCarouselSizeWidth(Math.floor(window.innerWidth * 0.4));
    setCarouselSizeHeight(Math.floor(window.innerWidth * 0.2));
  }, []);

  return (
    <div
      className="heroCarouselItem"
      style={{ transform: `translate(${props.pos * 100}%, 0%)` }}
    >
      <Image
        src={`https://picsum.photos/${carouselSizeWidth}/${carouselSizeHeight}?grayscale&random=1`}
        alt="advert_item"
        width={carouselSizeWidth}
        height={carouselSizeHeight}
      />
      <div className="heroCarouselItemIndex">1</div>
    </div>
  );
}
