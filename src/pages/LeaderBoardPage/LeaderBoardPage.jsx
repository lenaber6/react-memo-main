import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderBoardPage.module.css";
import cn from "classnames";
import hardColorImg from "./images/hardColor.png";
import hardGrayImg from "./images/hardGray.png";
import superColorImg from "./images/superColor.png";
import superGrayImg from "./images/superGray.png";
import { useEffect, useState } from "react";
import { getLeaderList } from "../../api/api";

const hardColor = hardColorImg;
const hardGray = hardGrayImg;
const superColor = superColorImg;
const superGray = superGrayImg;

export function LeaderBoardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    getLeaderList().then(data => {
      setLeaders(data.leaders.sort((a, b) => (a.time > b.time ? 1 : -1)).slice(0, 10));
    });
  }, []);

  function leaderTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const zeroMinutes = minutes < 10 ? 0 : "";
    const zeroSeconds = seconds < 10 ? 0 : "";

    return `${zeroMinutes}${minutes}:${zeroSeconds}${seconds}`;
  }
  function hardPlayed(list) {
    if (list.achievements.includes(1)) {
      return true;
    }
  }

  function superPlayed(list) {
    if (list.achievements.includes(2)) {
      return true;
    }
  }
  return (
    <>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.pagename}>Лидерборд</div>
          <Link to="/">
            <Button>Начать игру</Button>
          </Link>
        </div>
        <div className={styles.list}>
          <div className={cn(styles.listContent, styles.titleText)}>
            <div className={styles.position}>Позиция</div>
            <div className={styles.name}>Пользователь</div>
            <div className={styles.achievements}>Достижения</div>
            <div className={styles.time}>Время</div>
          </div>
          {leaders.map((list, index) => (
            <div className={cn(styles.listContent, styles.playerText)} key={list.id}>
              <div className={styles.position}># {index + 1}</div>
              <div className={styles.name}>{list.name}</div>
              <div className={styles.achievements}>
                {hardPlayed(list) ? (
                  <div className={styles.achievementsContent}>
                    <img className={styles.hardImg} src={hardColor} alt="hard played" />
                    <div className={styles.clueText}>
                      Игра пройдена
                      <br /> в сложном режиме
                    </div>
                  </div>
                ) : (
                  <div className={styles.achievementsContent}>
                    <img className={styles.hardImg} src={hardGray} alt="easy played" />
                    <div className={styles.clueText}>
                      Игра пройдена
                      <br /> в лёгком режиме
                    </div>
                  </div>
                )}
                {superPlayed(list) ? (
                  <div className={styles.achievementsContent}>
                    <img className={styles.achievementImg} src={superColor} alt="with super played" />
                    <div className={styles.clueText}>
                      Игра пройдена
                      <br /> без супер-сил
                    </div>
                  </div>
                ) : (
                  <div className={styles.achievementsContent}>
                    <img className={styles.achievementImg} src={superGray} alt="without super played" />
                    <div className={styles.clueText}>
                      Игра пройдена <br /> c супер-силами
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.time}>{leaderTime(list.time)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
