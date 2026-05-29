import styles from './checkbox.module.css';

interface CheckboxProps {
    label?: React.ReactNode;
    onChange?: () => void;
    disabled?: boolean;
    className?: string;
    checked?: boolean;
    name?: string;
}

const Checkbox = ({
    label,
    onChange,
    className,
    disabled = false,
    checked,
    name
}: CheckboxProps) => {
    return (
        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <input
                className={`${styles.checkbox} ${className || ''}`}
                type='checkbox'
                onChange={onChange}
                disabled={disabled}
                checked={checked}
                name={name}
                readOnly
            />

            {label && (
                <span className={styles.label}>
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
