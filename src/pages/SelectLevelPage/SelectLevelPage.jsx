import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import Checkbox from "../../components/CheckBox/CheckBox";
import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { useCheckbox } from "../../hooks/useCheckbox";

const levels = [3, 6, 9];

export function SelectLevelPage() {
  const { isEasyMode, setIsEasyMode } = useCheckbox();
  console.log();
  const [selectedLevel, setSelectedLevel] = useState(3);
  const easyRoute = isEasyMode ? "/easy-mode" : "";

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          {levels.map((level, index) => (
            <li
              className={selectedLevel === level ? styles.chosenLevel : styles.level}
              key={level}
              onClick={() => {
                setSelectedLevel(level);
              }}
            >
              {index + 1}
            </li>
          ))}
        </ul>
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
