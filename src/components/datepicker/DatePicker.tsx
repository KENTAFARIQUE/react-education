import React, { useState, useRef, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import styles from './datepicker.module.css';

interface DatePickerProps {
    children: ReactNode;
    value?: string;
    onChange?: (value: string) => void;
    minDate?: string;
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

function parseDisplayDate(s: string): Date | null {
    const m = s.match(DISPLAY_RE);
    if (!m) return null;
    const [, d, month, y, h, min] = m;
    return new Date(+y, +month - 1, +d, +h, +min);
}

const DatePicker = ({ children, value: externalValue, onChange, minDate }: DatePickerProps) => {
    const hiddenRef = useRef<HTMLInputElement>(null);
    const clearingRef = useRef(false);
    const [internalValue, setInternalValue] = useState('');
    const [touched, setTouched] = useState(false);

    const displayValue = internalValue || (externalValue || '');

    const formatError = touched && displayValue.length > 0 && !DISPLAY_RE.test(displayValue);

    const parsedDate = parseDisplayDate(displayValue);
    const parsedMinDate = minDate ? parseDisplayDate(minDate) : null;
    const minDateError = !formatError && parsedDate && parsedMinDate && parsedDate < parsedMinDate;

    const showError = !!(formatError || minDateError);

    const syncHiddenInput = useCallback((display: string) => {
        const iso = toIso(display);
        if (hiddenRef.current && iso) {
            hiddenRef.current.value = iso;
        }
    }, []);

    useEffect(() => {
        if (externalValue !== undefined && !clearingRef.current) {
            setInternalValue(externalValue);
        }
        clearingRef.current = false;
    }, [externalValue]);

    const handleChildChange = useCallback((raw: string) => {
        const filtered = filterInput(raw);
        syncHiddenInput(filtered);
        setInternalValue(filtered);
        setTouched(filtered.length > 0);

        const parsed = parseDisplayDate(filtered);
        const parsedMin = minDate ? parseDisplayDate(minDate) : null;
        const isValidFormat = DISPLAY_RE.test(filtered);
        const isAfterMin = !parsedMin || (parsed && parsed >= parsedMin);

        if (onChange) {
            if (filtered.length === 0) {
                onChange('');
            } else if (isValidFormat && isAfterMin) {
                onChange(filtered);
            } else {
                clearingRef.current = true;
                onChange('');
            }
        }
    }, [onChange, syncHiddenInput, minDate]);

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

    const isoMin = minDate ? toIso(minDate) : undefined;

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
        hasError: showError,
    }), [displayValue, handleChildChange, showError]);

    return (
        <div className={styles.fieldWrapper}>
            <div
                className={styles.wrapper}
                onClick={handleWrapperClick}
                onBlur={handleBlur}
            >
                {React.isValidElement(children)
                    ? React.cloneElement(children as React.ReactElement<{ value?: string; onChange?: (value: string) => void; hasError?: boolean }>, childProps)
                    : children
                }
                <input
                    ref={hiddenRef}
                    type="datetime-local"
                    className={styles.hiddenInput}
                    onChange={handleNativeChange}
                    {...(isoMin ? { min: isoMin } : {})}
                />
            </div>
            {showError && (
                <span className={styles.errorMessage}>
                    {formatError
                        ? 'Неверный формат. Используйте ДД.ММ.ГГГГ ЧЧ:ММ'
                        : 'Дата не может быть раньше доступной'}
                </span>
            )}
        </div>
    );
};

export default DatePicker;
