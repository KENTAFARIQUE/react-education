import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Input from '../../components/ui/input/Input';
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
                        <Input
					value="Ульяновск"
					labelAlign="right"
						/>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</div>
                        <Input
					value="kjhjkk"
					labelAlign="right"
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