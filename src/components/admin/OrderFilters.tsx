import styles from "./OrderFilters.module.css"

interface FilterOption {
  value: string;
  label: string;
}

interface OrderFiltersProps {
  dateOptions: FilterOption[];
  carOptions: string[];
  cityOptions: string[];
  statusOptions: FilterOption[];
  filterDate: string;
  filterCar: string;
  filterCity: string;
  filterStatus: string;
  onDateChange: (value: string) => void;
  onCarChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApply: () => void;
}

const OrderFilters = ({
  dateOptions,
  carOptions,
  cityOptions,
  statusOptions,
  filterDate,
  filterCar,
  filterCity,
  filterStatus,
  onDateChange,
  onCarChange,
  onCityChange,
  onStatusChange,
  onApply,
}: OrderFiltersProps) => {
  return (
    <div className={styles.filtersRow}>
      <div className={styles.filterField}>
        <select
          className={styles.filterSelect}
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
        >
          {dateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterField}>
        <select
          className={styles.filterSelect}
          value={filterCar}
          onChange={(e) => onCarChange(e.target.value)}
        >
          <option value="">Все</option>
          {carOptions.slice(1).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterField}>
        <select
          className={styles.filterSelect}
          value={filterCity}
          onChange={(e) => onCityChange(e.target.value)}
        >
          <option value="">Все</option>
          {cityOptions.slice(1).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterField}>
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <button className={styles.applyBtn} onClick={onApply}>
        Применить
      </button>
    </div>
  );
};

export default OrderFilters;
