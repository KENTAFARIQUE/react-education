import { Outlet } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';

const MainLayout = () => {
    return (
        <>
            <SideBar />
            <div className="App">
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;
