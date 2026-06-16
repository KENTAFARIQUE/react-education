import { YandexMap } from '../../components/map/YandexMap'
import Input from '../../components/ui/input/Input';
import Autocomplete from '../../components/autocomplete/Autocomplete';
import { useOrderStore } from '../../store/orderStore';
import styles from './geo.module.css';
import { useRef, useEffect, useMemo } from 'react';
import type { Marker, YandexMapRef } from '../../components/map/yandex-maps.types';
import { useCities } from '../../hooks/useCities';
import { useCityPoints } from '../../hooks/useCityPoints';
import { CITY_CENTERS, DEFAULT_CENTER } from '../../constants/coordinates';
import type { PointAttrs } from '../../types/geo';

interface GeoBlockProps {
	onSelectLocation?: (coordinates: [number, number]) => void;
}

const OFFSETS: readonly [number, number][] = [
	[0, 0],
	[0.005, 0.003],
	[-0.003, 0.006],
	[0.006, -0.003],
	[-0.004, -0.004],
	[0.003, -0.006],
	[-0.006, 0.004],
	[0.007, 0.007],
	[-0.002, 0.002],
];

type PointWithCoords = {
	point: PointAttrs;
	coordinates: [number, number];
};

const GeoBlock = ({ onSelectLocation }: GeoBlockProps) => {
	const mapRef = useRef<YandexMapRef>(null);
	const { city, cityId, pickupPoint, setCity, setPickupPoint, setLocationInfo } = useOrderStore();
	const yandexApiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY ?? ''

	const { cities, loading: citiesLoading, error: citiesError } = useCities();
	const { points, loading: pointsLoading, error: pointsError } = useCityPoints(cityId);

	const cityNames = useMemo(() => cities.map((c) => c.name), [cities]);

	const pointsWithCoords: PointWithCoords[] = useMemo(() => {
		return points.map((p, i) => {
			const base = CITY_CENTERS[p.cityId.id] || DEFAULT_CENTER;
			const offset = OFFSETS[i % OFFSETS.length];
			return {
				point: p,
				coordinates: [base[0] + offset[0], base[1] + offset[1]] as [number, number],
			};
		});
	}, [points]);

	const displayedMarkers: Marker[] = useMemo(() => {
		return pointsWithCoords.map(({ point, coordinates }) => ({
			id: point.id,
			coordinates,
			title: point.address,
			description: point.address,
		}));
	}, [pointsWithCoords]);

	const findCoordsByAddress = (address: string): [number, number] | undefined => {
		const found = pointsWithCoords.find(
			(p) => p.point.address === address || p.point.name === address
		);
		return found?.coordinates;
	};

	const handleCityInputChange = (value: string) => {
		const found = value.length > 0
			? cities.find((c) => c.name === value)
			: undefined;
		setCity(value, found?.id);
	};

	const handleCitySelect = (selectedName: string) => {
		const found = cities.find((c) => c.name === selectedName);
		setCity(selectedName, found?.id);
	};

	const handlePointInputChange = (value: string) => {
		setPickupPoint(value);
	};

	const handlePointSelect = (selectedAddress: string) => {
		const coords = findCoordsByAddress(selectedAddress);
		if (coords) {
			const point = points.find(
				(p) => p.address === selectedAddress || p.name === selectedAddress
			);
			if (point) {
				setLocationInfo(city, cityId!, point.address, point.id, coords);
				if (onSelectLocation) {
					onSelectLocation(coords);
				}
			}
		}
	};

	const handleMarkerClick = (marker: Marker) => {
		const address = marker.title || marker.id.toString();
		const coords = findCoordsByAddress(address);
		if (coords) {
			const point = points.find(
				(p) => p.address === address || p.name === address
			);
			if (point) {
				setLocationInfo(city, cityId!, point.address, point.id, coords);
				if (onSelectLocation) {
					onSelectLocation(coords);
				}
			}
		}
	};

	const mapCenter = useMemo((): [number, number] => {
		if (pickupPoint && pointsWithCoords.length > 0) {
			const selected = pointsWithCoords.find(
				(p) => p.point.address === pickupPoint
			);
			if (selected) return selected.coordinates;
		}
		if (pointsWithCoords.length > 0) {
			return pointsWithCoords[0].coordinates;
		}
		return DEFAULT_CENTER;
	}, [pickupPoint, pointsWithCoords]);

	useEffect(() => {
		if (pickupPoint && mapRef.current && pointsWithCoords.length > 0) {
			const selected = pointsWithCoords.find(
				(p) => p.point.address === pickupPoint
			);
			if (selected) {
				mapRef.current.setCenter(selected.coordinates, 14);
			}
		}
	}, [pickupPoint, pointsWithCoords]);

	useEffect(() => {
		if (cities.length > 0 && city && cityId === null) {
			const found = cities.find((c) => c.name === city);
			if (found) {
				setCity(city, found.id);
			}
		}
	}, [cities.length]);

	if (citiesError) {
		return <div className={styles.container}>Ошибка загрузки городов: {citiesError}</div>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.inputContainer}>
				<div className={styles.inputRow}>
					<span className={`${styles.inputText} ${styles.right}`}>Город</span>
					{citiesLoading ? (
						<Input placeholder="Загрузка городов..." value={city} readOnly />
					) : (
						<Autocomplete
							value={city}
							suggestions={cityNames}
							onChange={handleCityInputChange}
							onSelect={handleCitySelect}
						>
							<Input
								placeholder="Начните вводить город..."
								value={city}
								onChange={handleCityInputChange}
							/>
						</Autocomplete>
					)}
				</div>

				<div className={styles.inputRow}>
					<span className={`${styles.inputText} ${styles.left}`}>Пункт выдачи</span>
					<Autocomplete
						value={pickupPoint}
						suggestions={points.map((p) => p.address)}
						onChange={handlePointInputChange}
						onSelect={handlePointSelect}
					>
						<Input
							placeholder={
								pointsLoading
									? 'Загрузка точек...'
									: cityId === null
										? 'Сначала выберите город'
										: 'Начните вводить пункт...'
							}
							value={pickupPoint}
							onChange={handlePointInputChange}
							readOnly={!city.trim()}
						/>
					</Autocomplete>
					{pointsError && <span className={styles.inputText}>{pointsError}</span>}
				</div>
			</div>

			<span className={styles.inputText}>Выбрать на карте:</span>
			{yandexApiKey ? (
				<YandexMap
					ref={mapRef}
					apiKey={yandexApiKey}
					center={mapCenter}
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