import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from "./admin.module.css"
import Logo from '../../assets/Logo_Icon.svg?react'
import SearchIco from '../../assets/Shape.svg?react'
import NotificationIco from '../../assets/Notifications.svg?react'
import DropdownIco from '../../assets/dropdown_icon.svg?react'
import AddPostIco from '../../assets/Add New Post Icon.svg?react'
import BlogIco from '../../assets/Blog Icon.svg?react'
import BlogPostsIco from '../../assets/Blog Posts Icon.svg?react'
import Avatar from '../../assets/Avatar.png'
import { useAuthStore } from '../../store/authStore'

const AdminView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((s) => s.logout);
    const [searchValue, setSearchValue] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.success) {
            setToast(location.state.success);
        }
    }, [location.state]);

    const isActive = (path: string) =>
        location.pathname.startsWith(path);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className={styles.mainLayout}>
            <div className={styles.sideBar}>
                <div className={styles.logo}>
                    <Logo className={styles.logoPic}/>
                    <h1>Need for car</h1>
                </div>
                <div className={styles.btnCol}>
                    <button className={`${styles.btn} ${isActive('/admin/cars') ? styles.btnActive : ''}`} onClick={() => navigate('/admin/cars')}><BlogPostsIco className={styles.btnIco}/>Список автомобилей</button>
                    <button className={`${styles.btn} ${isActive('/admin/points') ? styles.btnActive : ''}`} onClick={() => navigate('/admin/points')}><BlogIco className={styles.btnIco}/>Пункты выдачи</button>
                    <button className={`${styles.btn} ${isActive('/admin/orders') ? styles.btnActive : ''}`} onClick={() => navigate('/admin/orders')}><AddPostIco className={styles.btnIco}/>Список заказов</button>
                    <button className={styles.btn}><BlogPostsIco className={styles.btnIco}/>Menu 4</button>
                </div>
            </div>
            <div className={styles.mainSection}>
                <header>
                    <div className={styles.searchField}>
                        <SearchIco></SearchIco>
                        <input
                            className={styles.searchInput}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Поиск ..."
                        />
                    </div>
                    <div className={styles.notificationsField}><NotificationIco></NotificationIco></div>
                    <div className={styles.profileWrapper} ref={profileRef}>
                        <div className={styles.profileField} onClick={() => setProfileOpen(!profileOpen)}>
                            <img src={Avatar} className={styles.avatar}/>
                            <span>Admin</span>
                            <DropdownIco className={styles.triangle}/>
                        </div>
                        {profileOpen && (
                            <div className={styles.profileDropdown}>
                                <button className={styles.dropdownItem}>Профиль</button>
                                <button className={styles.dropdownItem} onClick={() => { logout(); navigate('/admin/login'); }}>Выйти</button>
                            </div>
                        )}
                    </div>
                </header>
                {toast && (
                    <div className={styles.toast}>
                        <span>{toast}</span>
                        <button className={styles.toastClose} onClick={() => { setToast(null); navigate(location.pathname, { replace: true }); }}>✕</button>
                    </div>
                )}
                <div className={styles.pageContainer}>
                    <Outlet />
                </div>
                <footer>
                    <div className={styles.linksRow}>
                        <a href="https://kentafarique.github.io/react-education/" target="_blank" rel="noopener noreferrer">Главная страница</a>
                        <a>Ссылка</a>
                    </div>
                    <span>Copyright © 2020 Simbirsoft</span>
                </footer>
            </div>
        </div>
    )
};

export default AdminView;