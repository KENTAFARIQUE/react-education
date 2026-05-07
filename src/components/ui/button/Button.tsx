import styles from "./Button.module.css"

type ButtonVariant = 'primary' | 'green' | 'cian' | 'orange' | 'purple'
type ButtonWidth = 'small' | 'large'

interface ButtonProps {
  variant?: ButtonVariant
  width?: ButtonWidth
  children: React.ReactNode
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}


const Button = ({ children, onClick, className, disabled = false,  variant = 'primary', width = 'large'}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[variant]} ${styles[width]} ${disabled ? styles.disabled : ''} ${className || ''}`}
        >
            <div className={styles.content}>{children}</div>  
        </button> 
    )
}

export default Button;