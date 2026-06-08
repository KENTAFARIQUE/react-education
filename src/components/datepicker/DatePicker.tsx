import React, { useState, useRef, useCallback, useMemo, type ReactNode } from 'react';
import styles from './datepicker.module.css';

interface DatePickerProps {
    children: ReactNode;
    value?: string;
    onChange?: (value: string) => void;
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DISPLAY_RE = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/;

function toDisplay(iso: string): string {
    if (!ISO_RE.test(iso)) return iso;
    const [date, time] = iso.split('T');
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y} ${time}`;
}

function toIso(display: string): string {
    const m = display.match(DISPLAY_RE);
    if (!m) return '';
    const [, d, month, y, h, min] = m;
    const iso = `${y}-${month}-${d}T${h}:${min}`;
    return ISO_RE.test(iso) ? iso : '';
}

function filterInput(raw: string): string {
    return raw.replace(/[^\d:.\s]/g, '').slice(0, 16);
}

const DatePicker = ({ children, value: externalValue, onChange }: DatePickerProps) => {
    const hiddenRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState('');
    const [touched, setTouched] = useState(false);

    const displayValue = externalValue !== undefined ? externalValue : internalValue;
    const showError = touched && displayValue.length > 0 && !DISPLAY_RE.test(displayValue);

    const syncHiddenInput = useCallback((display: string) => {
        const iso = toIso(display);
        if (hiddenRef.current && iso) {
            hiddenRef.current.value = iso;
        }
    }, []);

    const handleChildChange = useCallback((raw: string) => {
        const filtered = filterInput(raw);
        syncHiddenInput(filtered);
        setInternalValue(filtered);
        if (filtered.length === 0) {
            setTouched(false);
        }
        if (onChange) {
            onChange(filtered);
        }
    }, [onChange, syncHiddenInput]);

    const handleNativeChange = useCallback(() => {
        if (!hiddenRef.current) return;
        const iso = hiddenRef.current.value;
        if (!iso) return;

        const display = toDisplay(iso);
        setInternalValue(display);
        setTouched(true);
        if (onChange) {
            onChange(display);
        }
    }, [onChange]);

    const handleWrapperClick = useCallback(() => {
        if (displayValue) return;
        hiddenRef.current?.showPicker();
    }, [displayValue]);

    const handleBlur = useCallback(() => {
        if (displayValue.length > 0) {
            setTouched(true);
        }
    }, [displayValue]);

    const childProps = useMemo(() => ({
        value: displayValue,
        onChange: handleChildChange,
    }), [displayValue, handleChildChange]);

    return (
        <div className={styles.fieldWrapper}>
            <div
                className={styles.wrapper}
                onClick={handleWrapperClick}
                onBlur={handleBlur}
            >
                {React.isValidElement(children)
                    /* eslint-disable-next-line react-hooks/refs */
                    ? React.cloneElement(children as React.ReactElement<{ value?: string; onChange?: (value: string) => void }>, childProps)
                    : children
                }
                <input
                    ref={hiddenRef}
                    type="datetime-local"
                    className={styles.hiddenInput}
                    onChange={handleNativeChange}
                />
            </div>
            {showError && (
                <span className={styles.errorMessage}>
                    Неверный формат. Используйте ДД.ММ.ГГГГ ЧЧ:ММ
                </span>
            )}
        </div>
    );
};

export default DatePicker;
