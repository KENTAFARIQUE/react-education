import styles from './radio.module.css';

interface RadioProps {
    label?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    checked?: boolean;
    name?: string;
}

const Radiobutton = ({
    label,
    onClick,
    className,
    disabled = false,
    checked,
    name
}: RadioProps) => {
    return (
        <label className={styles.radioWrapper}>
            <input
                className={`${styles.radiobutton} ${className || ''}`}
                type='radio'
                onClick={onClick}
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

export default Radiobutton;