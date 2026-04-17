import { useState, useEffect } from 'react';
import styles from './hamb.module.css'
import FbIco from '../../assets/Facebook_white.svg?react'
import TgIco from '../../assets/Telegram_white.svg?react'
import InstIco from '../../assets/Instagram_white.svg?react'

interface HambMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HambMenu = ({ isOpen, onClose }: HambMenuProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${styles.main} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.back1}>
        <div className={styles.btncont}>
          <button className={styles.txtbtn}>
            ПАРКОВКА
          </button>
          <button className={styles.txtbtn}>
            СТРАХОВКА
          </button>
          <button className={styles.txtbtn}>
            БЕНЗИН
          </button>
          <button className={styles.txtbtn}>
            ОБСЛУЖИВАНИЕ
          </button>
        </div>
        <div className={styles.linkscontainer}>
          <TgIco className={styles.icon} />
          <FbIco className={styles.icon} />
          <InstIco className={styles.icon} />
        </div>
      </div>
      <div className={styles.back2}></div>
    </div>
  );
}

export default HambMenu;