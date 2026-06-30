import { useParams, useNavigate } from 'react-router-dom';
import styles from './errorView.module.css';

const ErrorView = () => {
  const { code = '500' } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <span className={styles.code}>{code}</span>
      <h1 className={styles.title}>Что-то пошло не так</h1>
      <p className={styles.message}>Попробуйте перезагрузить страницу</p>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
};

export default ErrorView;
