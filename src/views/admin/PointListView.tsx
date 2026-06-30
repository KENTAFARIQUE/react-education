import { useState, useMemo } from 'react';
import { carApi } from '../../services/Api';
import { useAllPoints } from '../../hooks/useAllPoints';
import type { PointAttrs } from '../../types/geo';
import Pagination from '../../components/admin/Pagination';
import styles from './pointListView.module.css';
import filterStyles from '../../components/admin/OrderFilters.module.css';
import EditIco from '../../assets/tripoints.svg?react';
import DeleteIco from '../../assets/cross.svg?react';

const PAGE_SIZE = 4;

const PointListView = () => {
  const { points, loading, error, setPoints } = useAllPoints();
  const [page, setPage] = useState(1);

  const [filterCity, setFilterCity] = useState('');
  const [committedCity, setCommittedCity] = useState('');

  const cityOptions = useMemo(
    () => [...new Set(points.map((p) => p.cityId.name))],
    [points]
  );

  const filteredPoints = useMemo(() => {
    if (!committedCity) return points;
    return points.filter((p) => p.cityId.name === committedCity);
  }, [points, committedCity]);

  const totalPages = Math.max(1, Math.ceil(filteredPoints.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagePoints = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredPoints.slice(start, start + PAGE_SIZE);
  }, [filteredPoints, safePage]);

  const handleApply = () => {
    setCommittedCity(filterCity);
    setPage(1);
  };

  const handleDelete = async (point: PointAttrs) => {
    const confirmed = window.confirm(
      `Удалить пункт выдачи «${point.name}»?`
    );
    if (!confirmed) return;

    try {
      await carApi.deletePoint(point.id);
      setPoints((prev) => prev.filter((p) => p.id !== point.id));
    } catch {
      alert('Не удалось удалить пункт выдачи');
    }
  };

  const handleEdit = (point: PointAttrs) => {
    alert(`Редактировать пункт #${point.id} — «${point.name}»`);
  };

  const handleAdd = () => {
    alert('Добавить новый пункт выдачи');
  };

  if (loading) {
    return (
      <div className={styles.pointPanel}>
        <p className={styles.emptyState}>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pointPanel}>
        <p className={styles.emptyState}>Ошибка: {error}</p>
      </div>
    );
  }

  const noData = points.length === 0;
  const noFilteredData = !noData && filteredPoints.length === 0;

  const emptyMessage = noData
    ? 'Нет сохранённых пунктов выдачи'
    : 'Нет пунктов по заданным фильтрам';

  return (
    <>
      <div className={styles.headerRow}>
        <h1 className={styles.label}>Пункты выдачи</h1>
        <button className={styles.addBtn} onClick={handleAdd}>
          + Добавить пункт
        </button>
      </div>

      <div className={styles.pointPanel}>
        <div className={filterStyles.filtersRow}>
          <div className={filterStyles.filterField}>
            <select
              className={filterStyles.filterSelect}
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              <option value="">Все города</option>
              {cityOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <button className={filterStyles.applyBtn} onClick={handleApply}>
            Применить
          </button>
        </div>

        {noData || noFilteredData ? (
          <p className={styles.emptyState}>{emptyMessage}</p>
        ) : (
          <>
            <div className={styles.pointList}>
              {pagePoints.map((point) => (
                <div key={point.id} className={styles.pointRow}>
                  <span className={styles.colId}>{point.id}</span>
                  <span className={styles.colName}>{point.name}</span>
                  <span className={styles.colAddress}>{point.address}</span>
                  <span className={styles.colCity}>{point.cityId.name}</span>
                  <span className={styles.colActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
                      onClick={() => handleEdit(point)}
                    >
                      <EditIco /> Изменить
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => handleDelete(point)}
                    >
                      <DeleteIco /> Удалить
                    </button>
                  </span>
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

export default PointListView;
