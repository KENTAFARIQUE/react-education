import { useState, useEffect, useRef } from 'react';
import Button from '../../components/button/Button';
import styles from './slider.module.css';
import ArrowIcon from '../../assets/slider/arrow.svg?react';

import slide1 from '../../assets/slider/slide1.jpg';
import slide2 from '../../assets/slider/slide2.jpg';
import slide3 from '../../assets/slider/slide3.jpg';
import slide4 from '../../assets/slider/slide4.jpg';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Бесплатная парковка',
    description: 'Оставляйте машину на платных городских парковках и разрешенных местах, не нарушая ПДД, а также в аэропортах.',
    image: slide1,
  },
  {
    id: 2,
    title: 'Страховка включена',
    description: 'Каждая поездка застрахована на сумму до 2 миллионов рублей. Вы можете быть уверены в своей безопасности.',
    image: slide2,
  },
  {
    id: 3,
    title: 'Заправка без остановки',
    description: 'Заправляйтесь на наших партнерских АЗС без дополнительной оплаты. Бензин уже включен в стоимость аренды.',
    image: slide3,
  },
  {
    id: 4,
    title: 'Круглосуточная поддержка',
    description: 'Наша служба поддержки работает 24/7. Мы всегда готовы помочь вам в любой ситуации.',
    image: slide4,
  },
];


const AUTO_INTERVAL = 3000;
const RESUME_DELAY = 10000;

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoTimerRef = useRef<number | null>(null);     
  const resumeTimerRef = useRef<number | null>(null);    

  const stopAutoPlay = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const startAutoPlay = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
    }
    autoTimerRef.current = setInterval(() => {
      goToNext();
    }, AUTO_INTERVAL);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleUserInteraction = (callback: () => void) => {
    if (isAutoPlaying) {
      stopAutoPlay();
      setIsAutoPlaying(false);
    }

    callback();

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      startAutoPlay();
    }, RESUME_DELAY);
  };

  const handlePrev = () => {
    handleUserInteraction(goToPrev);
  };

  const handleNext = () => {
    handleUserInteraction(goToNext);
  };

  const handleDotClick = (index: number) => {
    handleUserInteraction(() => goToSlide(index));
  };

  useEffect(() => {
    startAutoPlay();

    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }, [isAutoPlaying]);

  const currentSlide = slides[currentIndex];

  return (
    <div className={styles.slider}>
      <button className={styles.arrow} onClick={handlePrev}>
        <ArrowIcon className={`${styles.arrowIco} ${styles.arrowLeft}`} />
      </button>

      <div className={styles.mainBlock}>
        <img 
          key={currentSlide.id}
          src={currentSlide.image} 
          alt={currentSlide.title} 
          className={styles.slideImage}
        />
        <div className={styles.content}>
          <h1>{currentSlide.title}</h1>
          <p>{currentSlide.description}</p>
          <Button className={styles.heroButton} text="Подробнее" />
        </div>
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      <button className={styles.arrow} onClick={handleNext}>
        <ArrowIcon className={`${styles.arrowIco} ${styles.arrowRight}`} />
      </button>
    </div>
  );
};

export default Slider;