import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import Checkbox from "../../components/CheckBox/CheckBox";

export function SelectLevelPage() {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        {/* 1) Требуется создать контекст, который будет передавать сохранять статус-данные режима (Провайдер (обернуть!)-состояние) */}
        {/* 2) Установить и отобразить количество попыток в компоненте Cards, там же будет состояние попыток  useState(isEasyMode ? 3 : 1); */}
        {/* 3) Нужно внутри ф-ции openCard создать условия, если включен лёгкий режим */}
        {/* 4) Если ровно 2 карточки без пары, а попытки ещё остались, то мы должны перевернуть открытые карточки без пары и вычесть попытку (includes, метод массивов, чтобы перевернуть карты) */}

        <Checkbox id={"modeCheckbox"} name={"modeCheckbox"} label={"Включить легкий режим"} onClick={() => {}} />
      </div>
    </div>
  );
}
