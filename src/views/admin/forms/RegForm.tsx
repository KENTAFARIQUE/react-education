import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from "./auth.module.css"
import { validateEmail, validatePassword, validatePasswordConfirm, sanitizeEmail, INPUT_MAX_LENGTH } from "./validation";
import { EyeOpen, EyeClosed } from "./icons";

const RegForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

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
        const confirmError = validatePasswordConfirm(password, confirm);

        setErrors({
            email: emailError ?? undefined,
            password: passwordError ?? undefined,
            confirm: confirmError ?? undefined,
        });

        if (!emailError && !passwordError && !confirmError) {
            console.log('Register:', sanitizedEmail, password);
        }
    }, [email, password, confirm]);

    return (
        <div className={styles.login_container}>
            <div className={styles.head_container}>
                <span>Регистрация</span>
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
                <div className={`${styles.inputRow}${errors.confirm ? ` ${styles.hasError}` : ''}`}>
                    <span>Подтвердите пароль</span>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            maxLength={INPUT_MAX_LENGTH}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowConfirm((v) => !v)}
                        >
                            {showConfirm ? <EyeClosed /> : <EyeOpen />}
                        </button>
                    </div>
                    {errors.confirm && <span className={styles.error}>{errors.confirm}</span>}
                </div>
            </div>
            <div className={styles.bottom_container}>
                <a>Запросить доступ</a>
                <Link to="/admin/login">Войти</Link>
                <button onClick={handleSubmit}>Регистрация</button>
            </div>
        </div>
    )
};

export default RegForm
