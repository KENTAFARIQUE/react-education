import Ellipse from "../../../assets/Ellipse.svg?react";
import styles from "./loader.module.css";

interface LoaderProps {
  color?: string;
}

const Loader = ({ color }: LoaderProps) => {
  return (
    <div className={styles.loader} style={{ color }}>
      <Ellipse className={styles.spinner} />
    </div>
  );
};

export default Loader;
