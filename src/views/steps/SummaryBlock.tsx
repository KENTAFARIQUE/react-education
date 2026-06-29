import { useOrderStore, type SavedOrder } from '../../store/orderStore';
import styles from './summary.module.css';
import carThumbnail from '../../assets/car.png';

interface SummaryBlockProps {
  savedOrder?: SavedOrder;
}

const SummaryBlock = ({ savedOrder }: SummaryBlockProps) => {
  const storeModel = useOrderStore((s) => s.selectedModel);
  const storeRentalStart = useOrderStore((s) => s.rentalStart);

  if (savedOrder) {
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <p className={styles.confirmed}>Ваш заказ подтверждён</p>
          <h2 className={styles.title}>{savedOrder.carName}</h2>
          <span className={styles.number}>В 777 ОР 73</span>
          <div className={styles.row}>
            <span className={styles.label}>Топливо</span>
            <span className={styles.value}>100%</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Доступна с</span>
            <span className={styles.value}>
              {new Date(savedOrder.dateFrom).toLocaleString("ru-RU")}
            </span>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={carThumbnail} alt={savedOrder.carName} className={styles.image} />
        </div>
      </div>
    );
  }

  if (!storeModel) return null;

  const imageSrc =
    storeModel.thumbnail?.path && storeModel.thumbnail.path !== ''
      ? storeModel.thumbnail.path
      : carThumbnail;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h2 className={styles.title}>{storeModel.name}</h2>
		<span className={styles.number}>В 777 ОР 73</span>
		<div className={styles.row}>
          <span className={styles.label}>Топливо</span>
          <span className={styles.value}>100%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Доступна с</span>
          <span className={styles.value}>{storeRentalStart}</span>
        </div>
      </div>
	<div className={styles.imageWrapper}>
        <img src={imageSrc} alt={storeModel.name} className={styles.image} />
      </div>
    </div>
  );
};

export default SummaryBlock;
