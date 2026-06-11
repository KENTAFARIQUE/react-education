import { Outlet } from 'react-router-dom';
import styles from './adminLayout.module.css';

const AdminLayout = () => {
    return (
        <div className={styles.adminLayout}>
            <Outlet />
        </div>
    );
};

export default AdminLayout;
