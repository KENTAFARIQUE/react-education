import styles from './slider.module.css'

const Slider = () => {
    return (
    <div className={styles.slider}>
        <button className={styles.arrow}>&#x3C;</button>
        <div className={styles.mainBlock}>
            <h1>Бесплатная парковка</h1>
            <p>Оставляйте машину на платных городских парковках и разрешенных местах, не нарушая ПДД, а также в аэропортах.</p>
            <button className={styles.details}>Подробнее</button>
            <div className={styles.dots}>. . . .</div>
        </div>
        <button className={styles.arrow}>&#x3e;</button>
    </div>
    )
}

export default Slider;