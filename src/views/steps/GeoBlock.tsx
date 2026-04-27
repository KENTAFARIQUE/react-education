import { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Input from '../../components/ui/input/Input';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import styles from './geo.module.css';

interface GeoBlockProps {
	onSelectLocation?: (coordinates: [number, number]) => void;
}

const GeoBlock = ({ onSelectLocation }: GeoBlockProps) => {
	const [pickupPoint, setPickupPoint] = useState('');
	
	const mapCenter: [number, number] = [54.317, 48.366];


	const pickupSuggestions: string[] = [
		'Ульяновск, ул. Ленина, 10',
		'Ульяновск, пр-т Нариманова, 45',
		'Ульяновск, ул. Гончарова, 22',
		'Ульяновск, Московское шоссе, 8',
		'Ульяновск, ул. Минаева, 3',
		'Ульяновск, ул. Розы Люксембург, 56',
		'Ульяновск, пр-т Созидателей, 15',
	];

	const handleClick = (e: any) => {
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
							placeholder="Начните вводить город..."
							value="Ульяновск"
						/>
					</div>

					<div className={styles.inputRow}>
			<div className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</div>
			<Autocomplete
				value={pickupPoint}
				suggestions={pickupSuggestions}
				onChange={setPickupPoint}
				onSelect={(value) => console.log('Выбрано:', value)}
			>
				<Input 
					placeholder="Начните вводить пункт..."
					value={pickupPoint}
					onChange={setPickupPoint}
				/>
			</Autocomplete>
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