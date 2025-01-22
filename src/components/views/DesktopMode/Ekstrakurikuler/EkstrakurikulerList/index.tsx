"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import styles from "./EkstrakurikulerList.module.scss";

const EKSTRAKURIKULER_DATA = [
  {
    id: 1,
    title: "Osis",
    image: "/osis.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero reprehenderit autem ab nesciunt tenetur sint consequuntur perferendis soluta, voluptatum illum dolorem sit. Delectus fuga quibusdam laboriosam laudantium cumque, cum illum.",
  },
  {
    id: 2,
    title: "Pramuka",
    image: "/pramuka.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero reprehenderit autem ab nesciunt tenetur sint consequuntur perferendis soluta, voluptatum illum dolorem sit.",
  },
  {
    id: 3,
    title: "Paskibra",
    image: "/paskibra.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero reprehenderit autem ab nesciunt tenetur sint consequuntur perferendis soluta.",
  },
  {
    id: 4,
    title: "PMR",
    image: "/pmr.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero reprehenderit autem ab nesciunt tenetur sint consequuntur.",
  },
];

const EkstrakurikulerView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const totalSlides = EKSTRAKURIKULER_DATA.length;

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      if (sliding) return;

      setSliding(true);
      setActiveIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % totalSlides;
        }
        return (prevIndex - 1 + totalSlides) % totalSlides;
      });

      setTimeout(() => setSliding(false), 300);
    },
    [sliding, totalSlides]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleSlideChange("prev");
      } else if (e.key === "ArrowRight") {
        handleSlideChange("next");
      }
    },
    [handleSlideChange]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={styles.ekstrakurikuler}>
      <button
        className={styles.ekstrakurikuler_icon_wrapper}
        onClick={() => handleSlideChange("prev")}
        aria-label="Previous slide"
        disabled={sliding}
      >
        <FontAwesomeIcon
          icon={["fas", "arrow-left"]}
          className={styles.ekstrakurikuler_icon}
        />
      </button>

      <div className={styles.ekstrakurikuler_container}>
        <div
          className={styles.ekstrakurikuler_container_wrapper}
          style={{
            transform: `translateX(-${activeIndex * 26}%)`,
            transition: sliding ? "transform 0.3s ease-in-out" : "none",
          }}
        >
          {EKSTRAKURIKULER_DATA.map((item) => (
            <div
              key={item.id}
              className={styles.ekstrakurikuler_container_wrapper_card}
            >
              <div
                className={styles.ekstrakurikuler_container_wrapper_card_imgBox}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} Image`}
                  width={300}
                  height={300}
                  loading="eager"
                  priority={activeIndex === item.id - 1}
                />
              </div>
              <div
                className={
                  styles.ekstrakurikuler_container_wrapper_card_infoPanel
                }
              >
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.ekstrakurikuler_icon_wrapper}
        onClick={() => handleSlideChange("next")}
        aria-label="Next slide"
        disabled={sliding}
      >
        <FontAwesomeIcon
          icon={["fas", "arrow-right"]}
          className={styles.ekstrakurikuler_icon}
        />
      </button>
    </div>
  );
};

export default EkstrakurikulerView;
