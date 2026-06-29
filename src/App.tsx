import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import MainView from './views/mainView/MainView';
import OrderView from './views/orderView/OrderView';
import AdminView from './views/admin/AdminView';
import OrderListView from './views/admin/OrderListView';
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
                        <Route index element={<span>Содержимое</span>} />
                        <Route path="orders" element={<OrderListView />} />
                    </Route>
                    <Route path="login" element={<AuthView />} />
                    <Route path="register" element={<AuthView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
