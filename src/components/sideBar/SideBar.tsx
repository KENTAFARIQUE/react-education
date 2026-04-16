import { useState } from 'react'
import HambMenu from '../hambmenu/HambMenu';

import styles from './sideBar.module.css';

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
        <button className="burger" onClick={toggleMenu}> {isMenuOpen ? '✕' : '≡'} </button>
        <button className="language">eng</button>
    </div>
    <HambMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
    );
}

export default SideBar;