import styles from "./admin.module.css"
import Logo from '../../assets/Logo_Icon.svg?react'
import SearchIco from '../../assets/Shape.svg?react'
import NotificationIco from '../../assets/Notifications.svg?react'
import DropdownIco from '../../assets/dropdown_icon.svg?react'
import AddPostIco from '../../assets/Add New Post Icon.svg?react'
import BlogIco from '../../assets/Blog Icon.svg?react'
import BlogPostsIco from '../../assets/Blog Posts Icon.svg?react'
import Avatar from '../../assets/Avatar.png'

    //fetch('https://frontend-study.simbirsoft.dev/api/auth/login', {})

    fetch('https://frontend-study.simbirsoft.dev/api/db/order', {
        headers: {'accept': "application/json",
             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJ1c2VyX2lkIjoiMSIsImlhdCI6MTc4MTc2NjU1OSwiZXhwIjoxNzgxNzcwMTU5fQ.prpmI6xcPSHG-wlQLdK2IckE4RoY7T6m0mAUsRxmTKI", 
             "Access-Control-Allow-Origin": "*"}
    })
const AdminView = () => {
    


    return (
        <div className={styles.mainLayout}>  
            <div className={styles.sideBar}>
                <div className={styles.logo}>
                    <Logo className={styles.logoPic}/>
                    <h1>Need for car</h1>
                </div>
                <div className={styles.btnCol}>
                    <button className={styles.btn}><BlogIco className={styles.btnIco}/>Карточка автомобиля</button>
                    <button className={styles.btn}><AddPostIco className={styles.btnIco}/>Список авто</button>
                    <button className={styles.btn}><BlogPostsIco className={styles.btnIco}/>Menu 4</button>
                </div>
            </div>
            <div className={styles.mainSection}>
                <header>
                    <div className={styles.searchField}>
                        <SearchIco></SearchIco>Поиск ...
                    </div>
                    <div className={styles.notificationsField}><NotificationIco></NotificationIco></div>
                    <div className={styles.profileField}>
                        <img src={Avatar} className={styles.avatar}/>
                        <span>Admin</span>
                        <DropdownIco className={styles.triangle}/>
                        <div className={styles.dropDownTrig}></div>
                    </div>
                </header>
                <div className={styles.pageContainer}>
                    Содержимое
                </div>
                <footer>
                    <div className={styles.linksRow}>
                        <a>Главная страница</a>
                        <a>Ссылка</a>
                    </div>
                    <span>Copyright © 2020 Simbirsoft</span>
                </footer>
            </div>
        </div>
    )
};

export default AdminView;