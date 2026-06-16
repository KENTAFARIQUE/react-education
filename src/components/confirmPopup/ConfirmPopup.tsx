import styles from './confirmPopup.module.css';
import Button from '../ui/button/Button';

interface ConfirmPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const ConfirmPopup = ({ onConfirm, onCancel, disabled }: ConfirmPopupProps) => {
  return (
    <div className={styles.overlay} onClick={disabled ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Подтвердить заказ</h2>
        <div className={styles.buttons}>
          <Button variant="primary" width="small" onClick={onConfirm} disabled={disabled}>
            <span>{disabled ? 'Отправка...' : 'Подтвердить'}</span>
          </Button>
          <Button variant="orange" width="small" onClick={onCancel} disabled={disabled}>
            <span>Вернуться</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
