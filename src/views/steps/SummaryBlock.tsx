import { useOrderStore } from '../../store/orderStore';
import styles from './summary.module.css';
import carThumbnail from '../../assets/car.png';

const SummaryBlock = () => {
  const selectedModel = useOrderStore((s) => s.selectedModel);
  const rentalStart = useOrderStore((s) => s.rentalStart);

  if (!selectedModel) return null;

  const imageSrc =
    selectedModel.thumbnail?.path && selectedModel.thumbnail.path !== ''
      ? selectedModel.thumbnail.path
      : carThumbnail;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h2 className={styles.title}>{selectedModel.name}</h2>
		<span className={styles.number}>В 777 ОР 73</span>
		<div className={styles.row}>
          <span className={styles.label}>Топливо</span>
          <span className={styles.value}>100%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Доступна с</span>
          <span className={styles.value}>{rentalStart}</span>
        </div>
      </div>
	<div className={styles.imageWrapper}>
        <img src={imageSrc} alt={selectedModel.name} className={styles.image} />
      </div>
    </div>
  );
};

export default SummaryBlock;
