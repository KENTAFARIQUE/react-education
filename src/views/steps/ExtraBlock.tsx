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
			<div className={styles.dateContainer}>
				<span>Дата аренды</span>
				<div className={styles.inputContainer}>
					<span className={`${styles.inputText} ${styles.left}`}>C</span>
					<DatePicker>
						<Input />
					</DatePicker>
				</div>
				<div className={styles.inputContainer}>
					<span className={`${styles.inputText} ${styles.left}`}>По</span>
					<DatePicker>
						<Input />
					</DatePicker>
				</div>
			</div>
			<div className={styles.rateContainer}>
				<span>Тариф</span>
				<li className={styles.choiceSortContainer}>
					<ul>
						<Radiobutton
							label='Поминутно, 7₽/мин'
							name='color'
						/>
					</ul>
					<ul>
						<Radiobutton
							label='На сутки, 1999 ₽/сутки'
							name='color'
						/>
					</ul>
				</li>
			</div>
			<div className={styles.extraContainer}>
				<span>Доп услуги</span>
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