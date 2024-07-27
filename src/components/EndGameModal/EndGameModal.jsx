import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import { useCheckbox } from "../../hooks/useCheckbox";
import submitImageUrl from "./images/submit.png";
import { postLeader } from "../../api/api";
import { useState } from "react";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, usedOnce }) {
  const { isEasyMode } = useCheckbox();

  const title = isWon ? "Вы попали в лидерборд!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const submitImg = submitImageUrl;

  // const nameInputElement = document.getElementById("name-input");
  const [nameInputElement, setNameInputElement] = useState({ name: "" });

  const handleNameInputChange = e => {
    const { name, value } = e.target;
    setNameInputElement({
      ...nameInputElement,
      [name]: value,
    });
  };

  // useEffect(newLeader => {
  //   setNameInputElement(newLeader);
  // }, []);

  const time = `${gameDurationMinutes.toString().padStart("2", "0")}.${gameDurationSeconds
    .toString()
    .padStart("2", "0")}`;

  const sumbitPostLeader = () => {
    const timeToBoard = gameDurationMinutes * 60 + gameDurationSeconds;
    let achievements = [];
    const hardPlayed = isWon && isEasyMode === false;

    postLeader({
      nameInputElement,
      time: timeToBoard,
      achievements: achievements,
    });
    achievements.filter(achiv => (achiv = hardPlayed));

    // if (hardPlayed) {
    //   achievements.unshift(1);
    //   console.log(achievements, achievements.length, "Hi");
    // }
    if (usedOnce === true) {
      achievements.push(2);
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isWon ? (
        <div className={styles.userblock}>
          <input
            id="name-input"
            type="text"
            name="name"
            value={nameInputElement.name}
            onChange={handleNameInputChange}
            className={styles.input}
            placeholder="Пользователь"
          />
          <Link to="/leaderboard">
            <img
              onClick={sumbitPostLeader}
              className={styles.submitImg}
              src={submitImg}
              alt="Отправить имя пользователя"
            />
          </Link>
        </div>
      ) : null}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>{time}</div>

      <Button onClick={onClick}>Играть снова</Button>
      <Link to="/leaderboard">
        <div className={styles.leaderBoardLink}>Перейти к лидерборду</div>
      </Link>
    </div>
  );
}
