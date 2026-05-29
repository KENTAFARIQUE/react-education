import styles from './extra.module.css'
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import Checkbox from '../../components/ui/checkbox/Checkbox';
import { Input } from '../../components/ui';
import DatePicker from '../../components/datepicker/DatePicker';
import { useOrderStore } from '../../store/orderStore';

const ADDITIONAL_OPTIONS = [
    { label: 'Полный бак, 500р', name: 'fuel' },
    { label: 'Детское кресло, 200р', name: 'chair' },
    { label: 'Правый руль, 1600р', name: 'right' },
];

const ExtraBlock = () => {
    const color = useOrderStore((state) => state.color);
    const setColor = useOrderStore((state) => state.setColor);
    const rentalStart = useOrderStore((state) => state.rentalStart);
    const setRentalStart = useOrderStore((state) => state.setRentalStart);
    const rentalEnd = useOrderStore((state) => state.rentalEnd);
    const setRentalEnd = useOrderStore((state) => state.setRentalEnd);
    const rate = useOrderStore((state) => state.rate);
    const setRate = useOrderStore((state) => state.setRate);
    const additionalOptions = useOrderStore((state) => state.additionalOptions);
    const toggleAdditionalOption = useOrderStore((state) => state.toggleAdditionalOption);

    return (
        <div className={styles.container}>
            <div className={styles.colorContainer}>
                <span>Цвет</span>
                <li className={styles.choiceSortContainer}>
                    <ul>
                        <Radiobutton
                            label='Любой'
                            name='color'
                            checked={color === 'Любой'}
                            onClick={() => setColor('Любой')}
                        />
                    </ul>
                </li>
            </div>
            <span>Дата аренды</span>
            <div className={styles.dateContainer}>
                <div className={styles.inputRow}>
                    <span className={styles.inputText}>C</span>
                    <DatePicker value={rentalStart} onChange={setRentalStart}>
                        <Input placeholder='Введите дату и время' />
                    </DatePicker>
                </div>
                <div className={styles.inputRow}>
                    <span className={styles.inputText}>По</span>
                    <DatePicker value={rentalEnd} onChange={setRentalEnd}>
                        <Input placeholder='Введите дату и время' />
                    </DatePicker>
                </div>
            </div>
            <span>Тариф</span>
            <div className={styles.rateContainer}>
                <Radiobutton
                    label='Поминутно, 7₽/мин'
                    name='rate'
                    checked={rate === 'Поминутно'}
                    onClick={() => setRate('Поминутно')}
                />
                <Radiobutton
                    label='На сутки, 1999 ₽/сутки'
                    name='rate'
                    checked={rate === 'На сутки'}
                    onClick={() => setRate('На сутки')}
                />
            </div>
            <span>Доп услуги</span>
            <div className={styles.extraContainer}>
                {ADDITIONAL_OPTIONS.map((option) => (
                    <Checkbox
                        key={option.name}
                        label={option.label}
                        name={option.name}
                        checked={additionalOptions.includes(option.name)}
                        onChange={() => toggleAdditionalOption(option.name)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExtraBlock;
	