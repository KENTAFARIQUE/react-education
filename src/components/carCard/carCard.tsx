import React from 'react';
import styles from './CarCard.module.css';

interface CarCardProps {
  name: string;
  priceMin: number;
  priceMax: number;
  thumbnail?: { path: string };
  className?: string; 
}

const CarCard: React.FC<CarCardProps> = ({
  name,
  priceMin,
  priceMax,
  thumbnail,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.price}>
          <span className={styles.priceValue}>
            {formatPrice(priceMin)} - {formatPrice(priceMax)} ₽
          </span>
        </div>
      </div>
      {thumbnail?.path && (
        <div className={styles.imageWrapper}>
          <img
            src={typeof thumbnail === 'string' ? thumbnail : thumbnail.path}
            alt={name}
            className={styles.image}
          />
        </div>
      )}
    </div>
  );
};

export default CarCard;