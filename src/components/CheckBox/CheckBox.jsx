/* eslint-disable prettier/prettier */
import { useCheckbox } from "../../hooks/useCheckbox";
import styles from "./CheckBox.module.css";

export default function Checkbox({ id, name, label, onClick }) {
  const {changeMode} = useCheckbox();

  return (
    <div className={styles.wrapper}>
      <input type="checkbox" id={id} name={name} className={styles.input} onClick={changeMode} />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
