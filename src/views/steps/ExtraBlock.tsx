import { useEffect } from 'react'
import styles from './extra.module.css'
import Radiobutton from '../../components/ui/radiobutton/Radiobutton';
import Checkbox from '../../components/ui/checkbox/Checkbox';
import { Input } from '../../components/ui';
import DatePicker from '../../components/datepicker/DatePicker';
import { useOrderStore } from '../../store/orderStore';
import { ADDITIONAL_OPTIONS } from '../../constants/orderOptions';

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
    const selectedModel = useOrderStore((state) => state.selectedModel);
    const carColors = selectedModel?.colors ?? [];

    const now = new Date();
    const todayStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const endMinDate = rentalStart || todayStr;

    useEffect(() => {
        if (rentalStart && rentalEnd) {
            const DISPLAY_RE = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/;
            const sm = rentalStart.match(DISPLAY_RE);
            const em = rentalEnd.match(DISPLAY_RE);
            if (sm && em) {
                const startDate = new Date(+sm[3], +sm[2] - 1, +sm[1], +sm[4], +sm[5]);
                const endDate = new Date(+em[3], +em[2] - 1, +em[1], +em[4], +em[5]);
                if (endDate < startDate) {
                    setRentalEnd('');
                }
            }
        }
    }, [rentalStart, rentalEnd, setRentalEnd]);

    return (
        <div className={styles.container}>
            <div className={styles.colorContainer} style={{ '--i': 0 } as React.CSSProperties}>
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
                    {carColors.map((c) => (
                        <ul key={c}>
                            <Radiobutton
                                label={c}
                                name='color'
                                checked={color === c}
                                onClick={() => setColor(c)}
                            />
                        </ul>
                    ))}
                </li>
            </div>

            <div className={`${styles.dateContainer} ${styles.section}`} style={{ '--i': 1 } as React.CSSProperties}>
                            <span>Дата аренды</span>
                <div className={styles.inputRow}>
                    <span className={styles.inputText}>C</span>
                    <DatePicker value={rentalStart} onChange={setRentalStart} minDate={todayStr}>
                        <Input placeholder='Введите дату и время' />
                    </DatePicker>
                </div>
                <div className={styles.inputRow}>
                    <span className={styles.inputText}>По</span>
                    <DatePicker value={rentalEnd} onChange={setRentalEnd} minDate={endMinDate}>
                        <Input placeholder='Введите дату и время' />
                    </DatePicker>
                </div>
            </div>

            <div className={`${styles.rateContainer} ${styles.section}`} style={{ '--i': 2 } as React.CSSProperties}>
                            <span>Тариф</span>
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

            <div className={`${styles.extraContainer} ${styles.section}`} style={{ '--i': 3 } as React.CSSProperties}>
                <span>Доп услуги</span>
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
	