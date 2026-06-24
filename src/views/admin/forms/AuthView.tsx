import { useLocation } from 'react-router-dom';
import LoginForm from "./LoginForm"
import RegForm from "./RegForm"
import Logo from '../../../assets/Logo_Icon.svg?react'
import styles from "./auth.module.css"

const AuthView = () => {
    const location = useLocation();
    const isLogin = location.pathname.endsWith('/login');

    return (
        <div className={styles.mainContainer}>
            <div className={styles.logo}>
                <Logo/>
                <h1>Need for drive</h1>
            </div>
            {isLogin
                ? <LoginForm />
                : <RegForm />
            }
        </div>
    )
};

export default AuthView;
