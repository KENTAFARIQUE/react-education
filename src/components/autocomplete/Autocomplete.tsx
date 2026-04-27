import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import styles from './autocomplete.module.css';

interface AutocompleteProps {
	children: ReactNode;
	suggestions: string[];
	value: string;
	onChange?: (value: string) => void;
	onSelect?: (value: string) => void;
}

const Autocomplete = ({ 
	children, 
	suggestions = [], 
	value,
	onChange,
	onSelect 
}: AutocompleteProps) => {
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		if (value.length > 0 && isOpen) {
			const filtered = suggestions.filter(item =>
				item.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredSuggestions(filtered);
		}
	}, [value, suggestions, isOpen]);

	const handleInputChange = (newValue: string) => {
		if (onChange) {
			onChange(newValue);
		}
		
		if (newValue.length > 0) {
			const filtered = suggestions.filter(item =>
				item.toLowerCase().includes(newValue.toLowerCase())
			);
			setFilteredSuggestions(filtered);
			setIsOpen(true);
		} else {
			setFilteredSuggestions([]);
			setIsOpen(false);
		}
	};

	const handleSelect = (selectedValue: string) => {
		// Закрываем список
		setIsOpen(false);
		setFilteredSuggestions([]);
		
		// Обновляем значение через onChange
		if (onChange) {
			onChange(selectedValue);
		}
		if (onSelect) {
			onSelect(selectedValue);
		}
	};

	return (
		<div className={styles.autocomplete} ref={wrapperRef}>
			{React.isValidElement(children) 
				? React.cloneElement(children as React.ReactElement<any>, {
					value: value,
					onChange: handleInputChange,
				})
				: children
			}
			
			{isOpen && filteredSuggestions.length > 0 && (
				<ul className={styles.suggestions}>
					{filteredSuggestions.map((suggestion, index) => (
						<li
							key={index}
							className={styles.suggestionItem}
							onClick={() => handleSelect(suggestion)}
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Autocomplete;