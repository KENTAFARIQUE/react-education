import { useState } from 'react';
import styles from './model.module.css';
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import { useCars } from '../../hooks/useCars';

const ModelBlock = () => {
	const [selected, setSelected] = useState('all');
	const { cars, loading, error } = useCars();

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
			
			<div className={styles.modelsGrid}></div>
			{cars.map(item => (<div>машина</div>))};
		</div>
	);
};

export default ModelBlock;