import Slider from '../../components/slider/Slider';
import Button from '../../components/button/Button';
import geoIco from '../../assets/geo.svg'
import styles from './mainView.module.css'

const MainView = () => {
    return (
    <div className={styles.main}>
        <div className={styles.heroBlock}>
            <header>
                <h3 className={styles.logo}>Need for drive</h3>
                <div className={styles.geo}>
                    <img src={geoIco}></img>
                    <span className={styles.city}>Ульяновск</span>
                </div>
            </header>
            <div className={styles.infoblock}>
                <div className={styles.txtblock}>
                    <h2>Каршеринг</h2>
                    <h1>Need for drive</h1>
                    <span>Поминутная аренда авто твоего города</span>
                </div>
                <Button className={styles.heroButton} text="Забронировать" />
            </div>
                <footer>
                    <span className={styles.info}>© 2016-2019 «Need for drive»</span>
                    <span className={styles.phone}>8 (495) 234-22-44</span>
                </footer>
        </div>
        <Slider/>
    </div>
    );
}

export default MainView;