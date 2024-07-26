import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import Checkbox from "../../components/CheckBox/CheckBox";
import { useState } from "react";
import { Button } from "../../components/Button/Button";
// import cn from "classnames";
import { useCheckbox } from "../../hooks/useCheckbox";

const levels = [3, 6, 9];

export function SelectLevelPage() {
  const { isEasyMode, setIsEasyMode } = useCheckbox();
  console.log();
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [choosenLevel, setChoosenLevel] = useState(null);

  const easyRoute = isEasyMode ? "/easy-mode" : "";

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          {levels.map((level, index) => (
            <li
              className={
                choosenLevel === 3 || choosenLevel === 6 || choosenLevel === 9 ? styles.choosenLevel : styles.level
              }
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setChoosenLevel();
              }}
            >
              {index + 1}
            </li>
          ))}

          {/* <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li> */}
        </ul>
        {/* 1) Требуется создать контекст, который будет передавать сохранять статус-данные режима (Провайдер (обернуть!)-состояние) */}
        {/* 2) Установить и отобразить количество попыток в компоненте Cards, там же будет состояние попыток  useState(isEasyMode ? 3 : 1); */}
        {/* 3) Нужно внутри ф-ции openCard создать условия, если включен лёгкий режим */}
        {/* 4) Если ровно 2 карточки без пары, а попытки ещё остались, то мы должны перевернуть открытые карточки без пары и вычесть попытку (includes, метод массивов, чтобы перевернуть карты) */}
        {/* ф-ция для установки данных, чтобы они обновились: если карточка - в открытых, */}
        {/* setCards(cards.map(card => (openCardsWithoutPair.includes(card) ? { ...card, open: false } : card))); */}
        <Checkbox
          id={"easy-mode"}
          name={"easy-mode"}
          label={"Включить легкий режим (игра до 3х ошибок)"}
          onClick={() => {
            setIsEasyMode(prev => !prev);
          }}
        />
        <Link to={`/game/${selectedLevel}${easyRoute}`}>
          <Button>Начать игру</Button>
        </Link>
        <Link to="/leaderboard">
          <div className={styles.leaderBoardLink}>Перейти к лидерборду</div>
        </Link>
      </div>
    </div>
  );
}
