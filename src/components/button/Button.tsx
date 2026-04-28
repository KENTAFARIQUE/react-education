import styles from "./Button.module.css"

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}


const Button = ({ text, onClick, disabled = false, className }: ButtonProps) => {
    return (
        <button 
            className={`${styles.button} ${className || ''}`}  
            onClick={onClick}
            disabled={disabled}
        >
            {text}   
        </button> 
    )
}

export default Button;