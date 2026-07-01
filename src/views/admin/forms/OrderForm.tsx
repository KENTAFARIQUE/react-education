import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../../store/orderStore';
import styles from './orderForm.module.css';

const STATUS_OPTIONS = [
  { value: '1', label: 'Новый' },
  { value: '2', label: 'Подтверждён' },
  { value: '3', label: 'Отменён' },
];

function toDateInput(ts: number) {
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function toTimestamp(dateStr: string) {
  return new Date(dateStr).getTime();
}

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((state) =>
    state.savedOrders.find((o) => o.id === Number(id))
  );
  const savedOrders = useOrderStore((state) => state.savedOrders);

  const [status, setStatus] = useState(String(order?.orderStatus_id ?? '1'));
  const [price, setPrice] = useState(String(order?.price ?? ''));
  const [dateFrom, setDateFrom] = useState(order ? toDateInput(order.dateFrom) : '');
  const [dateTo, setDateTo] = useState(order ? toDateInput(order.dateTo) : '');
  const [isFullTank, setIsFullTank] = useState(order?.isFullTank ?? false);
  const [isNeedChildChair, setIsNeedChildChair] = useState(order?.isNeedChildChair ?? false);
  const [isRightWheel, setIsRightWheel] = useState(order?.isRightWheel ?? false);
  const [saving, setSaving] = useState(false);

  if (!order) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <p className={styles.error}>Заказ не найден</p>
          <button className={styles.cancelBtn} onClick={() => navigate('/admin/orders')}>
            ← Назад к заказам
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated = {
      ...order,
      orderStatus_id: Number(status),
      price: Number(price),
      dateFrom: toTimestamp(dateFrom),
      dateTo: toTimestamp(dateTo),
      isFullTank,
      isNeedChildChair,
      isRightWheel,
    };

    useOrderStore.setState({
      savedOrders: savedOrders.map((o) =>
        o.id === order.id ? updated : o
      ),
    });

    setSaving(false);
    navigate('/admin/orders');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/admin/orders')}>
            ← Назад
          </button>
          <h1 className={styles.title}>Редактировать заказ #{order.id}</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.readonlyRow}>
            <span className={styles.readonlyLabel}>Автомобиль:</span>
            <span>{order.carName}</span>
          </div>
          <div className={styles.readonlyRow}>
            <span className={styles.readonlyLabel}>Город:</span>
            <span>{order.cityName}, {order.pointName}</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Статус</label>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Цена</label>
            <input
              className={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Дата начала</label>
              <input
                className={styles.input}
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Дата окончания</label>
              <input
                className={styles.input}
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isFullTank}
                onChange={(e) => setIsFullTank(e.target.checked)}
              />
              <span>Полный бак</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isNeedChildChair}
                onChange={(e) => setIsNeedChildChair(e.target.checked)}
              />
              <span>Детское кресло</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isRightWheel}
                onChange={(e) => setIsRightWheel(e.target.checked)}
              />
              <span>Правый руль</span>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/admin/orders')}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
