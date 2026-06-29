import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import type { SavedOrder } from '../../store/orderStore';
import OrderFilters from '../../components/admin/OrderFilters';
import Pagination from '../../components/admin/Pagination';
import styles from "./orderListView.module.css"
import carPlaceholder from '../../assets/car.png';
import CheckIco from '../../assets/check.svg?react'
import CrossIco from '../../assets/cross.svg?react'
import TripointsIco from '../../assets/tripoints.svg?react'

const DATE_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'today', label: 'За сегодня' },
  { value: 'week', label: 'За неделю' },
  { value: 'month', label: 'За месяц' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Все' },
  { value: '1', label: 'Новый' },
  { value: '2', label: 'Подтверждён' },
  { value: '3', label: 'Отменён' },
];

const PAGE_SIZE = 4;

function formatDateFull(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}

function formatPrice(price: number) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

const OrderListView = () => {
  const navigate = useNavigate();
  const savedOrders = useOrderStore((state) => state.savedOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [filterDate, setFilterDate] = useState('');
  const [filterCar, setFilterCar] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [committedDate, setCommittedDate] = useState('');
  const [committedCar, setCommittedCar] = useState('');
  const [committedCity, setCommittedCity] = useState('');
  const [committedStatus, setCommittedStatus] = useState('');
  const [page, setPage] = useState(1);

  const carOptions = useMemo(
    () => ['', ...new Set(savedOrders.map((o) => o.carName))],
    [savedOrders]
  );

  const cityOptions = useMemo(
    () => ['', ...new Set(savedOrders.map((o) => o.cityName))],
    [savedOrders]
  );

  const filteredOrders = useMemo(() => {
    return savedOrders.filter((order) => {
      if (committedCar && order.carName !== committedCar) return false;
      if (committedCity && order.cityName !== committedCity) return false;
      if (committedStatus && order.orderStatus_id !== Number(committedStatus)) return false;
      if (committedDate) {
        const now = new Date();
        const orderStart = new Date(order.dateFrom);
        let startBound: Date;
        if (committedDate === 'today') {
          startBound = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (committedDate === 'week') {
          startBound = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startBound = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        if (orderStart < startBound) return false;
      }
      return true;
    });
  }, [savedOrders, committedCar, committedCity, committedStatus, committedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageOrders = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, safePage]);

  const handleApply = () => {
    setCommittedDate(filterDate);
    setCommittedCar(filterCar);
    setCommittedCity(filterCity);
    setCommittedStatus(filterStatus);
    setPage(1);
  };

  if (savedOrders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Нет сохранённых заказов</p>
      </div>
    );
  }

  return (
    <>
    <h1 className={styles.label}>Заказы</h1>
    <div className={styles.orderPanel}>
      <OrderFilters
        dateOptions={DATE_OPTIONS}
        carOptions={carOptions}
        cityOptions={cityOptions}
        statusOptions={STATUS_OPTIONS}
        filterDate={filterDate}
        filterCar={filterCar}
        filterCity={filterCity}
        filterStatus={filterStatus}
        onDateChange={(v) => setFilterDate(v)}
        onCarChange={(v) => setFilterCar(v)}
        onCityChange={(v) => setFilterCity(v)}
        onStatusChange={(v) => setFilterStatus(v)}
        onApply={handleApply}
      />

      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Нет заказов по заданным фильтрам</p>
        </div>
      ) : (
        <>
          <div className={styles.orderList}>
            {pageOrders.map((order: SavedOrder) => (
              <div key={order.id} className={styles.orderRow}>
                <div className={styles.orderImageCol}>
                  <img
                    className={styles.orderImage}
                    src={order.carThumbnail || carPlaceholder}
                    alt={order.carName}
                  />
                </div>

                <div className={styles.orderInfoCol}>
                  <div className={styles.orderTitle}>
                    {order.carName} <span className={styles.orderSubtitle}>в {order.cityName}, {order.pointName}</span>
                  </div>
                  <div className={styles.orderDates}>
                    {formatDateFull(order.dateFrom)} — {formatDateFull(order.dateTo)}
                  </div>
                  <div className={styles.orderColor}>
                    Цвет: <span className={styles.orderTitle}>{order.color}</span>
                  </div>
                </div>

                <div className={styles.orderOptionsCol}>
                  <label className={styles.optionRow}>
                    <input type="checkbox" checked={order.isFullTank} readOnly className={styles.optionCheckbox} />
                    <span>Полный бак</span>
                  </label>
                  <label className={styles.optionRow}>
                    <input type="checkbox" checked={order.isNeedChildChair} readOnly className={styles.optionCheckbox} />
                    <span>Детское кресло</span>
                  </label>
                  <label className={styles.optionRow}>
                    <input type="checkbox" checked={order.isRightWheel} readOnly className={styles.optionCheckbox} />
                    <span>Правый руль</span>
                  </label>
                </div>

                <div className={styles.orderPriceCol}>
                  <span className={styles.orderPrice}>{formatPrice(order.price)}</span>
                </div>

                <div className={styles.orderActionsCol}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => updateOrderStatus(order.id, 2)}
                  >
                    <CheckIco /> Готово
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => updateOrderStatus(order.id, 3)}
                  >
                    <CrossIco /> Отмена
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    <TripointsIco /> Изменить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
    </>
  );
};

export default OrderListView;
