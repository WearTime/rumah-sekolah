"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./EkstrakurikulerList.module.scss";
import Image from "next/image";
import { useState } from "react";

const slidesData = [
  {
    title: "Osis",
    image: "/osis.png",
  },
  {
    title: "Pramuka",
    image: "/pramuka.png",
  },
  {
    title: "Paskibra",
    image: "/paskibra.png",
  },
  {
    title: "PMR",
    image: "/pmr.png",
  },
];

const EkstrakurikulerView = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
  };

  const goToPrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length
    );
  };

  return (
    <div className={styles.ekstrakurikuler}>
      <FontAwesomeIcon
        icon={["fas", "arrow-left"]}
        className={styles.ekstrakurikuler_icon}
        onClick={goToPrev}
      />
      <div className={styles.ekstrakurikuler_content}>
        <h1>{slidesData[activeIndex].title}</h1>
        <Image
          src={slidesData[activeIndex].image}
          alt="Kegiatan Image"
          width={950}
          height={405}
        />
      </div>
      <FontAwesomeIcon
        icon={["fas", "arrow-right"]}
        className={styles.ekstrakurikuler_icon}
        onClick={goToNext}
      />
    </div>
  );
};

export default EkstrakurikulerView;
