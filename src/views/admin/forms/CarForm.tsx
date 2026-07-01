import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carApi } from '../../../services/Api';
import styles from './carForm.module.css';

const TOTAL_SECTIONS = 4;
const MAX_LENGTH = 150;

type FieldErrors = {
  name?: string;
  categoryName?: string;
  colors?: string;
  colorInput?: string;
};

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('economy');
  const [description, setDescription] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colorList, setColorList] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};

    if (!name.trim()) e.name = 'Поле не может быть пустым';
    else if (name.trim().length > MAX_LENGTH) e.name = `Максимум ${MAX_LENGTH} символов`;

    if (!categoryName.trim()) e.categoryName = 'Поле не может быть пустым';
    else if (categoryName.trim().length > MAX_LENGTH) e.categoryName = `Максимум ${MAX_LENGTH} символов`;

    if (selectedColors.length === 0) e.colors = 'Выберите хотя бы один цвет';
    if (colorList.some((c) => c.length > MAX_LENGTH)) e.colors = `Цвет не может быть длиннее ${MAX_LENGTH} символов`;

    if (colorInput.trim()) {
      if (colorInput.trim().length > MAX_LENGTH) e.colorInput = `Максимум ${MAX_LENGTH} символов`;
      else if (colorList.includes(colorInput.trim())) e.colorInput = 'Такой цвет уже добавлен';
    }

    return e;
  };

  const canAddColor = (): boolean => {
    const trimmed = colorInput.trim();
    if (!trimmed) return false;
    if (trimmed.length > MAX_LENGTH) return false;
    if (colorList.includes(trimmed)) return false;
    return true;
  };

  const blur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        setLoading(true);
        const { data: cars } = await carApi.getAllCars();
        const car = cars.find((c: { id: number }) => c.id === Number(id));
        if (!car) {
          setError('Автомобиль не найден');
          return;
        }
        const apiColors = Array.isArray(car.colors)
          ? car.colors
          : car.colors
            ? car.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
            : [];
        setName(car.name || '');
        setCategoryName(car.categoryId?.name?.toLowerCase() || 'economy');
        setDescription(car.description || '');
        setColorList([...apiColors]);
        setSelectedColors([...apiColors]);
        if (car.thumbnail?.path) {
          setImagePreview(car.thumbnail.path);
        }
      } catch {
        setError('Не удалось загрузить данные автомобиля');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (!canAddColor()) return;
    setColorList((prev) => [...prev, trimmed]);
    setSelectedColors((prev) => [...prev, trimmed]);
    setColorInput('');
    setErrors(validate());
  };

  const handleColorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddColor();
    }
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploadedFileName(file.name);
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm(`Удалить автомобиль «${name}»?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await carApi.deleteCar(Number(id));
      navigate('/admin/cars');
    } catch {
      setError('Не удалось удалить автомобиль');
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validate();
    setErrors(allErrors);
    setTouched({ name: true, categoryName: true, colors: true });

    if (Object.keys(allErrors).some((k) => k !== 'colorInput')) {
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      name,
      colors: selectedColors,
      description,
      categoryId: {
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      },
    };

    try {
      if (isEdit) {
        await carApi.updateCar(Number(id), payload);
      } else {
        await carApi.createCar(payload);
      }
      navigate('/admin/cars', { state: { success: 'Успех! Машина сохранена' } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const filledCount = [
    name.trim() !== '',
    categoryName.trim() !== '',
    selectedColors.length > 0,
    description.trim() !== '',
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Карточка автомобиля</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.columns}>
        {/* LEFT COLUMN — Photo, Status, Description */}
        <div className={styles.leftCol}>
          <div className={styles.photoCard}>
            <div className={styles.photoArea}>
              {imagePreview ? (
                <img src={imagePreview} alt="Превью" className={styles.previewImage} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span>Фото автомобиля</span>
                </div>
              )}
            </div>

            {name && <div className={styles.previewModel}>{name}</div>}
            {categoryName && <div className={styles.previewDesc}>{categoryName}</div>}

            <div className={styles.fileRow}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleImageChange}
              />
              <span className={styles.fileName}>
                {uploadedFileName || 'Выберите файл'}
              </span>
              <button
                type="button"
                className={styles.browseBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Обзор
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.statusText}>
              <span>Заполнено</span>
              <span>{Math.round((filledCount / TOTAL_SECTIONS) * 100)}%</span>
            </div>
            <div className={styles.statusBar}>
              <div className={styles.statusBarFill} style={{ width: `${(filledCount / TOTAL_SECTIONS) * 100}%` }} />
            </div>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label className={styles.label}>Описание</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Settings */}
        <div className={styles.rightCol}>
          <div className={styles.settingsCard}>
            <h2 className={styles.settingsTitle}>Настройки автомобиля</h2>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Модель автомобиля</label>
                <input
                  className={`${styles.input}${touched.name && errors.name ? ` ${styles.inputError}` : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => blur('name')}
                  maxLength={MAX_LENGTH}
                />
                {touched.name && errors.name && <span className={styles.fieldError}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Тип автомобиля</label>
                <input
                  className={`${styles.input}${touched.categoryName && errors.categoryName ? ` ${styles.inputError}` : ''}`}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onBlur={() => blur('categoryName')}
                  maxLength={MAX_LENGTH}
                />
                {touched.categoryName && errors.categoryName && <span className={styles.fieldError}>{errors.categoryName}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Доступные цвета</label>
              <div className={styles.colorAddRow}>
                <input
                  className={`${styles.input}${errors.colorInput ? ` ${styles.inputError}` : ''}`}
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={handleColorKeyDown}
                  placeholder="Название цвета"
                  maxLength={MAX_LENGTH}
                />
                <button
                  type="button"
                  className={styles.addColorBtn}
                  onClick={handleAddColor}
                  disabled={!canAddColor()}
                >
                  +
                </button>
              </div>
              {errors.colorInput && <span className={styles.fieldError}>{errors.colorInput}</span>}

              {colorList.length > 0 && (
                <div className={styles.colorList}>
                  {colorList.map((color) => (
                    <label key={color} className={styles.colorItem}>
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleColor(color)}
                        className={styles.colorCheckbox}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              )}
              {touched.colors && errors.colors && <span className={styles.fieldError}>{errors.colors}</span>}
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
                onClick={() => navigate('/admin/cars')}
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
