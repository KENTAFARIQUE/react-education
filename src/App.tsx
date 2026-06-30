import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import MainView from './views/mainView/MainView';
import OrderView from './views/orderView/OrderView';
import AdminView from './views/admin/AdminView';
import OrderListView from './views/admin/OrderListView';
import CarListView from './views/admin/CarListView';
import PointListView from './views/admin/PointListView';
import ErrorView from './views/admin/ErrorView';
import AuthView from './views/admin/forms/AuthView';

function App() {

    return (
        <BrowserRouter basename="react-education/">
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<MainView />} />
                    <Route path="/order" element={<OrderView />} />
                    <Route path="/order/:step" element={<OrderView />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route element={<AdminView />}>
                        <Route index element={<Navigate to="cars" replace />} />
                        <Route path="cars" element={<CarListView />} />
                        <Route path="points" element={<PointListView />} />
                        <Route path="orders" element={<OrderListView />} />
                        <Route path="error/:code" element={<ErrorView />} />
                        <Route path="*" element={<Navigate to="/admin/error/404" replace />} />
                    </Route>
                    <Route path="login" element={<AuthView />} />
                    <Route path="register" element={<AuthView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
