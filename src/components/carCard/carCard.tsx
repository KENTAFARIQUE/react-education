// CarCard.tsx
import React from 'react';
import styles from './CarCard.module.css';
import carThumbnail from '../../assets/car.png';

interface CarCardProps {
  name: string;
  priceMin: number;
  priceMax: number;
  thumbnail?: { path: string };
  className?: string;
  onClick?: () => void; 
  isSelected?: boolean; 
}

const CarCard: React.FC<CarCardProps> = ({
  name,
  priceMin,
  priceMax,
  thumbnail,
  onClick,
  isSelected,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const imageSrc = thumbnail?.path && thumbnail.path !== "" ? thumbnail.path : carThumbnail;

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.price}>
          <span className={styles.priceValue}>
            {formatPrice(priceMin)} - {formatPrice(priceMax)} ₽
          </span>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={name}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default CarCard;