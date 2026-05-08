import { YandexMap } from '../../components/map/YandexMap'
import Input from '../../components/ui/input/Input';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import { useOrderStore } from '../../store/orderStore';
import styles from './geo.module.css';
import { useRef, useEffect } from 'react';
import type { Marker, YandexMapRef } from '../../components/map/yandex-maps.types';

interface GeoBlockProps {
	onSelectLocation?: (coordinates: [number, number]) => void;
}

const GeoBlock = ({ onSelectLocation }: GeoBlockProps) => {
	const mapRef = useRef<YandexMapRef>(null);
	const state = useOrderStore(state => state);
	const { city, pickupPoint, setCity, setPickupPoint, setLocationInfo} = state;
	const yandexApiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY ?? ''

	const mapCenter: [number, number] = [54.317, 48.366];

	const pickupPointsMap: Record<string, [number, number]> = {
		'Ульяновск, ул. Ленина, 10': [54.315, 48.375],
		'Ульяновск, пр-т Нариманова, 45': [54.320, 48.360],
		'Ульяновск, ул. Гончарова, 22': [54.310, 48.365],
		'Ульяновск, Московское шоссе, 8': [54.325, 48.370],
		'Ульяновск, ул. Минаева, 3': [54.318, 48.372],
		'Ульяновск, ул. Розы Люксембург, 56': [54.312, 48.358],
		'Ульяновск, пр-т Созидателей, 15': [54.322, 48.368],
	};

	const pickupSuggestions: string[] = Object.keys(pickupPointsMap);
	const displayedMarkers: Marker[] = Object.entries(pickupPointsMap).map(([title, coords]) => ({
		id: title,
		coordinates: coords,
		title,
		description: title,
	}));

	const handleMarkerClick = (marker: Marker) => {
		const pointTitle = marker.title || marker.id.toString();
		setLocationInfo('Ульяновск', pointTitle, marker.coordinates);
		if (onSelectLocation) {
			onSelectLocation(marker.coordinates);
		}
	};

	useEffect(() => {
		if (pickupPoint && mapRef.current && pickupPointsMap[pickupPoint]) {
			const coords = pickupPointsMap[pickupPoint];
			mapRef.current.setCenter(coords, 14);
		}
	}, [pickupPoint, pickupPointsMap]);

	return (
		<div className={styles.container}>
				<div className={styles.inputContainer}>
					<div className={styles.inputRow}>
						<span className={`${styles.inputText} ${styles.right}`}>Город</span>
						<Input
							placeholder="Начните вводить город..."
							value={city}
							onChange={setCity}
						/>
					</div>

					<div className={styles.inputRow}>
			<span className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</span>
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
				{yandexApiKey ? (
					<YandexMap
					ref={mapRef}
					apiKey={yandexApiKey}
					center={pickupPoint && pickupPointsMap[pickupPoint] ? pickupPointsMap[pickupPoint] : mapCenter}
					zoom={pickupPoint ? 14 : 12}
					markers={displayedMarkers}
					onMarkerClick={handleMarkerClick}
					className={styles.map}
				/>
			) : (
				<div className={styles.apiKeyWarning}>
					Укажи VITE_YANDEX_MAPS_API_KEY в .env, чтобы увидеть демо-карту.
				</div>
			)}
		</div>
	);
};

export default GeoBlock;