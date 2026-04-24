import { useNavigate } from 'react-router-dom';


import Slider from '../../components/slider/Slider';
import Button from '../../components/ui/button/Button';
import Header from '../../components/header/Header';
import styles from './mainView.module.css'

const MainView = () => {
    const navigate = useNavigate();

	const handleOrder = () => {
		navigate('/order');
	};

    return (
    <div className={styles.main}>
        <div className={styles.heroBlock}>
            <Header></Header>
            <div className={styles.infoblock}>
                <div className={styles.txtblock}>
                    <h2>Каршеринг</h2>
                    <h1>Need for drive</h1>
                    <span>Поминутная аренда авто твоего города</span>
                </div>
                <Button className={styles.heroButton} onClick={handleOrder}>Забронировать</Button>
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