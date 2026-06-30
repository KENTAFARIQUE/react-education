import { useState, useMemo } from 'react';
import { carApi } from '../../services/Api';
import { useCars } from '../../hooks/useCars';
import type { Car } from '../../hooks/useCars';
import Pagination from '../../components/admin/Pagination';
import styles from './carListView.module.css';
import filterStyles from '../../components/admin/OrderFilters.module.css';
import carPlaceholder from '../../assets/car.png';
import EditIco from '../../assets/tripoints.svg?react';
import DeleteIco from '../../assets/cross.svg?react';

const PAGE_SIZE = 4;

function formatPrice(price: number) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

const CarListView = () => {
  const { cars, loading, error, setCars } = useCars();
  const [page, setPage] = useState(1);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [committedCategory, setCommittedCategory] = useState('');
  const [committedPrice, setCommittedPrice] = useState('');

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (committedCategory) {
      result = result.filter(
        (car) => car.categoryId?.name?.toLowerCase() === committedCategory
      );
    }

    if (committedPrice === 'asc') {
      result.sort((a, b) => a.priceMin - b.priceMin);
    } else if (committedPrice === 'desc') {
      result.sort((a, b) => b.priceMin - a.priceMin);
    }

    return result;
  }, [cars, committedCategory, committedPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageCars = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredCars.slice(start, start + PAGE_SIZE);
  }, [filteredCars, safePage]);

  const handleApply = () => {
    setCommittedCategory(filterCategory);
    setCommittedPrice(filterPrice);
    setPage(1);
  };

  const handleDelete = async (car: Car) => {
    const confirmed = window.confirm(
      `Удалить автомобиль «${car.name}»?`
    );
    if (!confirmed) return;

    try {
      await carApi.deleteCar(car.id);
      setCars((prev) => prev.filter((c) => c.id !== car.id));
    } catch {
      alert('Не удалось удалить автомобиль');
    }
  };

  const handleEdit = (car: Car) => {
    alert(`Редактировать автомобиль #${car.id} — «${car.name}»`);
  };

  const handleAdd = () => {
    alert('Добавить новый автомобиль');
  };

  if (loading) {
    return (
      <div className={styles.carPanel}>
        <p className={styles.emptyState}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.carPanel}>
        <p className={styles.emptyState}>Ошибка: {error}</p>
      </div>
    );
  }

  const noData = cars.length === 0;
  const noFilteredData = !noData && filteredCars.length === 0;

  const emptyMessage = noData
    ? 'Нет сохранённых автомобилей'
    : 'Нет автомобилей по заданным фильтрам';

  const renderFilters = () => (
    <div className={filterStyles.filtersRow}>
      <div className={filterStyles.filterField}>
        <select
          className={filterStyles.filterSelect}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="economy">Economy</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className={filterStyles.filterField}>
        <select
          className={filterStyles.filterSelect}
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        >
          <option value="">Любая цена</option>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      <button className={filterStyles.applyBtn} onClick={handleApply}>
        Применить
      </button>
    </div>
  );

  return (
    <>
      <div className={styles.headerRow}>
        <h1 className={styles.label}>Автомобили</h1>
        <button className={styles.addBtn} onClick={handleAdd}>
          + Добавить автомобиль
        </button>
      </div>

      <div className={styles.carPanel}>
        {renderFilters()}

        {noData || noFilteredData ? (
          <p className={styles.emptyState}>{emptyMessage}</p>
        ) : (
          <>
            <div className={styles.carList}>
              {pageCars.map((car) => (
                <div key={car.id} className={styles.carRow}>
                  <div className={styles.carImageCol}>
                    <img
                      className={styles.carImage}
                      src={car.thumbnail?.path || carPlaceholder}
                      alt={car.name}
                    />
                  </div>

                  <div className={styles.carInfoCol}>
                    <div className={styles.carTitle}>{car.name}</div>
                    <div className={styles.carSubtitle}>
                      {car.categoryId?.name || 'Без категории'}
                    </div>
                    {car.number && (
                      <div className={styles.carDetail}>
                        Номер: {car.number}
                      </div>
                    )}
                  </div>

                  <div className={styles.carPriceCol}>
                    <div className={styles.carPrice}>
                      {formatPrice(car.priceMin)}
                    </div>
                    <div className={styles.carPriceDelim}>—</div>
                    <div className={styles.carPrice}>
                      {formatPrice(car.priceMax)}
                    </div>
                  </div>

                  <div className={styles.carDescCol}>
                    {truncate(car.description, 80)}
                  </div>

                  <div className={styles.carActionsCol}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
                      onClick={() => handleEdit(car)}
                    >
                      <EditIco /> Изменить
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => handleDelete(car)}
                    >
                      <DeleteIco /> Удалить
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

export default CarListView;
