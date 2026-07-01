import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carApi } from '../../../services/Api';
import { useCities } from '../../../hooks/useCities';
import type { CityAttrs } from '../../../types/geo';
import styles from './pointForm.module.css';

interface FormData {
  name: string;
  address: string;
  cityId: string;
}

const initialForm: FormData = {
  name: '',
  address: '',
  cityId: '',
};

const PointForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { cities } = useCities();

  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || cities.length === 0) return;

    const fetchPoint = async () => {
      try {
        setLoading(true);
        const { data: points } = await carApi.getAllPoints();
        const point = points.find((p: { id: number }) => p.id === Number(id));
        if (!point) {
          setError('Пункт выдачи не найден');
          return;
        }
        setForm({
          name: point.name || '',
          address: point.address || '',
          cityId: String(point.cityId?.id ?? ''),
        });
      } catch {
        setError('Не удалось загрузить данные пункта выдачи');
      } finally {
        setLoading(false);
      }
    };

    fetchPoint();
  }, [id, cities]);

  const set = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedCity = cities.find((c) => String(c.id) === form.cityId);

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm(`Удалить пункт выдачи «${form.name}»?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await carApi.deletePoint(Number(id));
      navigate('/admin/points');
    } catch {
      setError('Не удалось удалить пункт выдачи');
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;

    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      name: form.name,
      address: form.address,
      cityId: { id: selectedCity.id, name: selectedCity.name },
    };

    try {
      if (isEdit) {
        await carApi.updatePoint(Number(id), payload);
      } else {
        await carApi.createPoint(payload);
      }
      navigate('/admin/points', { state: { success: 'Успех! Пункт выдачи сохранён' } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Пункт выдачи</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Название</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Адрес</label>
            <input
              className={styles.input}
              value={form.address}
              onChange={(e) => set('address')(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Город</label>
            <select
              className={styles.select}
              value={form.cityId}
              onChange={(e) => set('cityId')(e.target.value)}
              required
            >
              <option value="">Выберите город</option>
              {cities.map((c: CityAttrs) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving || !selectedCity}
            >
              {saving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/admin/points')}
            >
              Отмена
            </button>
            {isEdit && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={saving}
              >
                Удалить
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointForm;
