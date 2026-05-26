import { useState } from 'react';
import styles from './model.module.css';
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import CarCard from '../../components/carCard/carCard';
import { useCars } from '../../hooks/useCars';
import { useOrderStore } from '../../store/orderStore'; 

const ModelBlock = () => {
	const [selected, setSelected] = useState('all');
	const { cars, loading, error } = useCars();
	const { setSelectedModel, selectedModel } = useOrderStore();

	if (loading) return <div>Loading...</div>;

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
			
			<div className={styles.modelsGrid}>
			{cars.map(item => (
				<CarCard
				key={item.id}
				name={item.name}
				priceMin={item.priceMin}
				priceMax={item.priceMax}
				thumbnail={item.thumbnail}
				onClick={() => setSelectedModel({ name: item.name, priceMin: item.priceMin, priceMax: item.priceMax })}
				isSelected={selectedModel?.name === item.name}
				/>
			))}
			</div>
		</div>
	);
};

export default ModelBlock;