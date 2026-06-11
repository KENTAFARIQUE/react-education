import { useState, useCallback } from 'react';
import styles from "./auth.module.css"
import { validateEmail, validatePassword, sanitizeEmail, INPUT_MAX_LENGTH } from "./validation";
import { EyeOpen, EyeClosed } from "./icons";

interface LoginFormProps {
    onSwitch: () => void;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleEmailBlur = useCallback(() => {
        const sanitized = sanitizeEmail(email);
        if (sanitized !== email) {
            setEmail(sanitized);
        }
    }, [email]);

    const handleSubmit = useCallback(() => {
        const sanitizedEmail = sanitizeEmail(email);
        setEmail(sanitizedEmail);

        const emailError = validateEmail(sanitizedEmail);
        const passwordError = validatePassword(password);

        setErrors({
            email: emailError ?? undefined,
            password: passwordError ?? undefined,
        });

        if (!emailError && !passwordError) {
            console.log('Login:', sanitizedEmail, password);
        }
    }, [email, password]);

    return (
        <div className={styles.login_container}>
            <div className={styles.head_container}>
                <span>Вход</span>
            </div>
            <div className={styles.input_container}>
                <div className={`${styles.inputRow}${errors.email ? ` ${styles.hasError}` : ''}`}>
                    <span>Почта</span>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        maxLength={INPUT_MAX_LENGTH}
                        placeholder="example@mail.com"
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
                <div className={`${styles.inputRow}${errors.password ? ` ${styles.hasError}` : ''}`}>
                    <span>Пароль</span>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={INPUT_MAX_LENGTH}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <EyeClosed /> : <EyeOpen />}
                        </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>
            </div>
            <div className={styles.bottom_container}>
                <a>Запросить доступ</a>
                <a onClick={onSwitch}>Регистрация</a>
                <button onClick={handleSubmit}>Войти</button>
            </div>
        </div>
    )
};

export default LoginForm
