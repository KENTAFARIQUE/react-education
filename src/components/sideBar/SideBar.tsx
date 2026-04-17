import { useState } from 'react'
import HambMenu from '../hambmenu/HambMenu';
import BurgerIco from '../../assets/menu_btn.svg?react'
import CloseIco from '../../assets/menu_btn_close.svg?react'

import styles from './sidebar.module.css';

const SideBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    return (
    <>
    <div className={styles.sidebar}>
        <button onClick={toggleMenu}> {isMenuOpen ? <CloseIco className={styles.togglebtn}/> : <BurgerIco className={styles.togglebtn}/>} </button>
        {isMenuOpen ? null : <button className={styles.language}>Eng</button>}
    </div>
    <HambMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
    );
}

export default SideBar;