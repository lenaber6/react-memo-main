import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link, useParams } from "react-router-dom";
import { useCheckbox } from "../../hooks/useCheckbox";
import submitImageUrl from "./images/submit.png";
import { postLeader } from "../../api/api";
import { useState } from "react";
import { sanitizeHtml } from "../sanitizeHtml";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, usedOnce }) {
  const { isEasyMode } = useCheckbox();
  const { pairsCount } = useParams();

  const hardLevelPairsNumber = 9;
  const isLeader = isWon && Number(pairsCount) === hardLevelPairsNumber;

  // const title = isWon ? "Вы попали в лидерборд!" : "Вы проиграли!";
  const title = isLeader ? "Вы попали в лидерборд!" : isWon ? "Вы выиграли!!!" : "Вы проиграли((";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const submitImg = submitImageUrl;

  // const nameInputElement = document.getElementById("name-input");
  const [nameInputElement, setNameInputElement] = useState({ name: "" });
  const [nameInputElementDirty, setNameInputElementDirty] = useState(false);
  const [nameInputElementError, setNameInputElementError] = useState("Поле не может быть пустым");

  const blurHandler = e => {
    switch (e.target.name) {
      case "name":
        setNameInputElementDirty(true);
        break;

      default:
        break;
    }
  };

  const handleNameInputChange = e => {
    const { name, value } = e.target;
    setNameInputElement({
      ...nameInputElement,
      [name]: value,
    });
    const valid = /^[a-zа-я][a-zа-я0-9-]*$/i;
    if (!valid.test(String(e.target.value))) {
      setNameInputElementError("Некорректное имя пользователя!");
    } else if (e.target.value.length < 3 || e.target.value.length > 8) {
      setNameInputElementError("Имя должно иметь 3-8 букв");
    } else {
      setNameInputElementError("");
    }
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

    if (hardPlayed) {
      achievements.unshift(1);
      console.log(achievements, achievements.length, "Hi");
    }
    if (usedOnce === true) {
      achievements.push(2);
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isLeader ? (
        <div className={styles.userblock}>
          {nameInputElementDirty && nameInputElementError && (
            <div style={{ color: "red", fontFamily: "StratosSkyeng" }}>{nameInputElementError}</div>
          )}
          <div className={styles.userblockSubmit}>
            <input
              id="name-input"
              type="text"
              name="name"
              onBlur={e => blurHandler(e)}
              required
              value={sanitizeHtml(nameInputElement.name)}
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
