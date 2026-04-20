import styles from './hamb.module.css';
import FbIco from '../../assets/Facebook_white.svg?react';
import TgIco from '../../assets/Telegram_white.svg?react';
import InstIco from '../../assets/Instagram_white.svg?react';

interface HambMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const HambMenu = ({ isOpen }: HambMenuProps) => {
  if (!isOpen) return null;


  return (
    <div className={styles.main}>
      <div className={styles.back1}>
        <div className={styles.btncont}>
          <button 
            className={styles.txtbtn}

          >
            ПАРКОВКА
          </button>
          <button 
            className={styles.txtbtn}
          >
            СТРАХОВКА
          </button>
          <button 
            className={styles.txtbtn}
          >
            БЕНЗИН
          </button>
          <button 
            className={styles.txtbtn}
          >
            ОБСЛУЖИВАНИЕ
          </button>
        </div>
        <div className={styles.linkscontainer}>
          <TgIco className={styles.icon} />
          <FbIco className={styles.icon} />
          <InstIco className={styles.icon} />
        </div>
        <button className={styles.language}>Eng</button>
      </div>
      <div className={styles.back2}></div>
    </div>
  );
};

export default HambMenu;