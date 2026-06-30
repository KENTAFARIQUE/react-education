import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./auth.module.css"
import { validateUsername, validatePassword, validatePasswordConfirm, INPUT_MAX_LENGTH } from "./validation";
import { EyeOpen, EyeClosed } from "./icons";
import { useAuthStore } from '../../../store/authStore';

const RegForm = () => {
    const navigate = useNavigate();
    const register = useAuthStore((s) => s.register);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);
        const confirmError = validatePasswordConfirm(password, confirm);

        setErrors({
            username: usernameError ?? undefined,
            password: passwordError ?? undefined,
            confirm: confirmError ?? undefined,
        });

        if (usernameError || passwordError || confirmError) return;

        setLoading(true);
        setApiError(null);

        try {
            await register(username.trim(), password);
            navigate('/admin/cars', { replace: true });
        } catch (err: any) {
            setApiError(err.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    }, [username, password, confirm, register, navigate]);

    return (
        <div className={styles.login_container}>
            <div className={styles.head_container}>
                <span>Регистрация</span>
            </div>
            <div className={styles.input_container}>
                {apiError && <div className={styles.apiError}>{apiError}</div>}
                <div className={`${styles.inputRow}${errors.username ? ` ${styles.hasError}` : ''}`}>
                    <span>Логин</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={INPUT_MAX_LENGTH}
                    />
                    {errors.username && <span className={styles.error}>{errors.username}</span>}
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
                <button onClick={handleSubmit} disabled={loading}>Регистрация</button>
            </div>
        </div>
    )
};

export default RegForm
