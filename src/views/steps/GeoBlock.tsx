import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import styles from './geo.module.css';

interface GeoBlockProps {
	onSelectLocation?: (coordinates: [number, number]) => void;
}

const GeoBlock = ({ onSelectLocation }: GeoBlockProps) => {
	// Координаты центра карты (Ульяновск)
	const mapCenter: [number, number] = [54.317, 48.366];

	const handleClick = (e: any) => {
		// Получаем координаты места, куда кликнул пользователь
		const coords = e.get('coords');
		if (onSelectLocation) {
			onSelectLocation(coords);
		}
	};

	return (
		<div className={styles.container}>
			<YMaps>
                <div className={styles.inputContainer}>
                    <div className={styles.inputRow}>
                        <div className={`${styles.inputText} ${styles.right}`}>Город</div>
                        <input
                            type="text"
                            className={styles.inputField}
                            value="Ульяновск"
                            readOnly
                        />
                    </div>

                    <div className={styles.inputRow}>
                        <div className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</div>
                        <input
                            type="text"
                            className={styles.inputField}
                            placeholder="Начните вводить пункт ..."
                        />
                    </div>
                </div>
                    <span className={styles.inputText}>Выбрать на карте:</span>
				<Map
					defaultState={{ center: mapCenter, zoom: 12 }}
					className={styles.map}
					width="100%"
					height="400px"
					onClick={handleClick}
				>
					<Placemark geometry={mapCenter} />
				</Map>
                
			</YMaps>
		</div>
	);
};

export default GeoBlock;