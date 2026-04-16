import Slider from '../../components/slider/Slider';
import styles from './mainView.module.css'

const MainView = () => {
    return (
    <div className={styles.main}>
        <div className={styles.heroBlock}>
            <header>
                <h3 className="logo">Need for drive</h3>
                <div className="geo">
                    <div className="mapIcon">0</div>
                    <span>Ульяновск</span>
                </div>
            </header>
            <div className={styles.infoblock}>
                <div className={styles.txtblock}>
                    <h2>Каршеринг</h2>
                    <h1>Need for drive</h1>
                    <span>Поминутная аренда авто твоего города</span>
                </div>
                <button>Забронировать</button>
            </div>
            <footer>
                <span className="info">© 2016-2019 «Need for drive»</span>
                <span className="phone">8 (495) 234-22-44</span>
            </footer>
        </div>
        <Slider/>
    </div>
    );
}

export default MainView;