import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Input from '../../components/ui/input/Input';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import { useOrderStore } from '../../store/orderStore';
import styles from './geo.module.css';

interface GeoBlockProps {
	onSelectLocation?: (coordinates: [number, number]) => void;
}

const GeoBlock = ({ onSelectLocation }: GeoBlockProps) => {
	const city = useOrderStore((state) => state.city);
	const pickupPoint = useOrderStore((state) => state.pickupPoint);
	const setCity = useOrderStore((state) => state.setCity);
	const setPickupPoint = useOrderStore((state) => state.setPickupPoint);
	const setPickupCoordinates = useOrderStore((state) => state.setPickupCoordinates);

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
		setPickupCoordinates(coords);
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
							value={city}
							onChange={setCity}
						/>
					</div>

					<div className={styles.inputRow}>
			<div className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</div>
			<Autocomplete
				value={pickupPoint}
				suggestions={pickupSuggestions}
				onChange={setPickupPoint}
				onSelect={(value) => setPickupPoint(value)}
			>
				<Input 
					placeholder="Начните вводить пункт..."
					value={pickupPoint}
					onChange={setPickupPoint}
					readOnly={!city.trim()}
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