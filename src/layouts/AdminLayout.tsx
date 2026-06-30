import { Outlet, Navigate, useLocation } from 'react-router-dom';
import styles from './adminLayout.module.css';
import { useAuthStore } from '../store/authStore';

const PUBLIC_PATHS = ['/admin/login', '/admin/register'];

const AdminLayout = () => {
    const token = useAuthStore((s) => s.token);
    const location = useLocation();
    const isPublic = PUBLIC_PATHS.some((p) => location.pathname.startsWith(p));

    if (!token && !isPublic) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className={styles.adminLayout}>
            <Outlet />
        </div>
    );
};

export default AdminLayout;
