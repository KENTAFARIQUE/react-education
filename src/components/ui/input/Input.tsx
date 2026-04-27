import { useState, useEffect } from 'react';
import styles from './Input.module.css';

interface InputProps {
	value?: string;
	placeholder?: string;
	readOnly?: boolean;
	onChange?: (value: string) => void;
	onFocus?: () => void;
}

const Input = ({ value, placeholder, readOnly, onChange, onFocus }: InputProps) => {
	const [inputValue, setInputValue] = useState(value || '');

	// Синхронизируем внутреннее состояние с пропсом value
	useEffect(() => {
		setInputValue(value || '');
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	const handleClear = () => {
		setInputValue('');
		if (onChange) {
			onChange('');
		}
	};

	return (
		<div className={styles.inputRow}>
			<div className={styles.inputWrapper}>
				<input
					type="text"
					className={styles.inputField}
					value={inputValue}
					placeholder={placeholder}
					readOnly={readOnly}
					onChange={handleChange}
					onFocus={onFocus}
				/>
				{inputValue && !readOnly && (
					<button className={styles.clearBtn} onClick={handleClear} type="button">
						&times;
					</button>
				)}
			</div>
		</div>
	);
};

export default Input;