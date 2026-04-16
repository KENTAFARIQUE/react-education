import styles from './hamb.module.css'

interface HambMenuProps {
  isOpen: boolean;
  onClose: () => void;
}


const HambMenu = ({ isOpen, onClose }: HambMenuProps) => {
    if (!isOpen) return null;

    return (
    <div className={styles.main}>
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
                <div className={styles.icon}>
                    tg
                </div>
                <div className={styles.icon}>
                    fb
                </div>
                <div className={styles.icon}>
                    inst
                </div>
            </div>
        </div>
        <div className={styles.back2}></div>
    </div>
    );
}

export default HambMenu;