import { useState } from 'react';
import LoginForm from "./LoginForm"
import RegForm from "./RegForm"
import Logo from '../../../assets/Logo_Icon.svg?react'
import styles from "./auth.module.css"

const AuthView = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.logo}>
                <Logo/>
                <h1>Need for drive</h1>
            </div>
            {isLogin
                ? <LoginForm onSwitch={() => setIsLogin(false)} />
                : <RegForm onSwitch={() => setIsLogin(true)} />
            }
        </div>
    )
};

export default AuthView;
