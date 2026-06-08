import { useState, useMemo } from 'react';
import styles from './model.module.css';
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import CarCard from '../../components/carCard/carCard';
import { useCars } from '../../hooks/useCars';
import { useOrderStore } from '../../store/orderStore'; 
import Loader from '../../components/ui/loader/Loader';

const ModelBlock = () => {
	const [selected, setSelected] = useState('all');
	const { cars, loading, error } = useCars();
	const { setSelectedModel, selectedModel } = useOrderStore();

	const filteredCars = useMemo(() => {
		if (selected === 'all') return cars;
		return cars.filter(car =>
			selected === 'premium' ? car.priceMax >= 3000 : car.priceMax < 3000
		);
	}, [cars, selected]);

	if (loading) return <Loader />;

	if (error) return <div>{error}</div>;

	if (!cars.length) return <div>No data found</div>;

	return (
		<div className={styles.container}>
			<li className={styles.choiceSortContainer}>
				<ul>
					<Radiobutton
						label='Все модели'
						onClick={() => setSelected('all')}
						checked={selected === 'all'}
						name='models'
					/>
				</ul>

				<ul>
					<Radiobutton
						label='Эконом'
						onClick={() => setSelected('econom')}
						checked={selected === 'econom'}
						name='models'
					/>
				</ul>

				<ul>
					<Radiobutton
						label='Премиум'
						onClick={() => setSelected('premium')}
						checked={selected === 'premium'}
						name='models'
					/>
				</ul>
			</li>
			
			<div className={styles.modelsGrid} key={selected}>
			{filteredCars.map((item, index) => (
				<div className={styles.cardWrapper} style={{ '--i': index } as React.CSSProperties} key={item.id}>
				<CarCard
				name={item.name}
				priceMin={item.priceMin}
				priceMax={item.priceMax}
				thumbnail={item.thumbnail}
				onClick={() => {
					const carColors = Array.isArray(item.colors) ? item.colors : (item.colors ? [item.colors] : []);
					setSelectedModel({ id: item.id, name: item.name, priceMin: item.priceMin, priceMax: item.priceMax, colors: carColors, thumbnail: item.thumbnail });
				}}
				isSelected={selectedModel?.name === item.name}
				/>
				</div>
			))}
			</div>
		</div>
	);
};

export default ModelBlock;