import styles from './header.module.css'
import geoIco from '../../assets/geo.svg'

const Header = () => {
  return (
    <header>
        <h3 className={styles.logo}>Need for drive</h3>
        <div className={styles.geo}>
            <img src={geoIco}></img>
            <span className={styles.city}>Ульяновск</span>
        </div>
    </header>
  );
};

export default Header;