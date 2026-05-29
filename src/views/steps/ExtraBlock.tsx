import styles from './extra.module.css'
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import Checkbox from '../../components/ui/checkbox/Checkbox';
import { Input } from '../../components/ui';
import DatePicker from '../../components/datepicker/DatePicker';

const ExtraBlock = () => {
	return (
		<div className={styles.container}>
			<div className={styles.colorContainer}>
				<span>Цвет</span>
				<li className={styles.choiceSortContainer}>
					<ul>
						<Radiobutton
							label='Любой'
							name='color'
						/>
					</ul>
				</li>
			</div>
							<span>Дата аренды</span>
			<div className={styles.dateContainer}>

				<div className={styles.inputRow}>
					<span className={styles.inputText}>C</span>
					<DatePicker>
						<Input />
					</DatePicker>
				</div>
				<div className={styles.inputRow}>
					<span className={styles.inputText}>По</span>
					<DatePicker>
						<Input />
					</DatePicker>
				</div>
			</div>
							<span>Тариф</span>
			<div className={styles.rateContainer}>

						<Radiobutton
							label='Поминутно, 7₽/мин'
name='rate'
					/>
					<Radiobutton
						label='На сутки, 1999 ₽/сутки'
						name='rate'
						/>
			</div>
							<span>Доп услуги</span>
			<div className={styles.extraContainer}>

				<Checkbox label='Полный бак, 500р'
							name='fuel'/>
				<Checkbox label='Детское кресло, 200р'
							name='chair'/>
				<Checkbox label='Правый руль, 1600р'
							name='right'/>
			</div>
		</div>
	);
};

export default ExtraBlock;