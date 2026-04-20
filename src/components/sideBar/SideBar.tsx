import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HambMenu from '../hambmenu/HambMenu';
import BurgerIco from '../../assets/menu_btn.svg?react'
import CloseIco from '../../assets/menu_btn_close.svg?react'
import styles from './sidebar.module.css';

const SideBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    const navigateTo = (path: string) => {
        navigate(path);
        closeMenu();
    };

    return (
    <>
    <div className={`${styles.sidebar} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <button onClick={toggleMenu}> {isMenuOpen ? <CloseIco className={styles.togglebtnClosed}/> : <BurgerIco className={styles.togglebtn}/>} </button>
        {isMenuOpen ? null : <button className={styles.language}>Eng</button>}
    </div>
    <HambMenu isOpen={isMenuOpen} onClose={closeMenu} onNavigate={navigateTo}/>
    </>
    );
}
export default SideBar;