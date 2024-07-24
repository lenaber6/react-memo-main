import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { getTimerValue } from "../../utils/timer";
import { STATUS_IN_PROGRESS, STATUS_LOST, STATUS_PREVIEW, STATUS_WON } from "../../const";
import { useParams } from "react-router-dom";
import alohomoraImg from "./images/alohomora1.png";
import epiphanyImg from "./images/epiphany.png";
import cn from "classnames";

const alohomora = alohomoraImg;
const epiphany = epiphanyImg;

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { mode } = useParams();
  console.log(mode);

  const [mistakes, setMistakes] = useState(3);
  const [areCardsOpened, setAreCardsOpened] = useState(false);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  // По умолчанию по окончании игры статус - LOST, его можно поменять на leaderboard

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может переходить в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (areCardsOpened || clickedCard.open) return;

    const updatedCards = cards.map(card => (card.id === clickedCard.id ? { ...card, open: true } : card));
    setCards(updatedCards);

    if (updatedCards.every(card => card.open)) {
      finishGame(STATUS_WON);
      return;
    }

    const openCards = updatedCards.filter(card => card.open);

    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
      return sameCards.length < 2;
    });
    if (mode === "easy-mode") {
      handleEasyMode(openCardsWithoutPair, updatedCards);
      return;
    }
    console.log(mode, "easy-mode");

    if (openCardsWithoutPair.length >= 2) {
      finishGame(STATUS_LOST);
    }
  };

  const handleEasyMode = (openCardsWithoutPair, updatedCards) => {
    if (openCardsWithoutPair.length < 2) return;

    if (openCardsWithoutPair.length === 2) {
      setAreCardsOpened(true);
    }

    const nextCards = toggleCardsOpenStatus(updatedCards, openCardsWithoutPair, true);
    setCards(nextCards);

    setTimeout(() => {
      const nextCards = toggleCardsOpenStatus(updatedCards, openCardsWithoutPair, false);
      setCards(nextCards);
      setAreCardsOpened(false);
    }, 1000);

    if (mistakes === 1) {
      finishGame(STATUS_LOST);
      setMistakes(3);
      return;
    }

    setMistakes(prev => prev - 1);
  };

  const toggleCardsOpenStatus = (currentCards, targetCards, openStatus) => {
    return currentCards.map(card => {
      if (card.id === targetCards[0].id || card.id === targetCards[1].id) {
        return { ...card, open: openStatus };
      }
      return card;
    });
  };

  // Игровое поле после открытия кликнутой карты
  // Берём все карты, мапим, сверяем id той карты, на которую кликнули и первой
  // const nextCards = cards.map(card => {
  // если id не равно - карту не переворачивать, вернуть
  // if (card.id !== clickedCard.id) {
  //   return card;
  // }
  // иначе- открыть вторую карту
  // после return стоит объект, у кот. несколько свойств, их мы пропускаем через ...card
  // return {
  // структуризация: все др. св-ва карт остались, поменялось только open
  //     ...card,
  //     open: true,
  //   };
  // });
  // Когда сказали, что карточка совпала и открыта, то переустанавливаем это в состояние
  // А когда меняется состояние - происходит перерисовка
  // setCards(nextCards);
  // если все карточки открыты, то пользователь выиграл, open становится true
  // const isPlayerWon = nextCards.every(card => card.open);

  // Победа - все карты на поле открыты
  // if (isPlayerWon) {
  //   finishGame(STATUS_WON);
  // return останавливает игру, если пользователь выиграл, дальше играть нет смысла
  // всё, что ниже return, выполняться не будет.
  //   return;
  // }

  // Если не выиграли
  // Открытые карты на игровом поле, filter фильтрует по условию, возвращает новый массив и проверяет card.open=true, то поместить в массив
  // const openCards = nextCards.filter(card => card.open);

  // Ищем открытые карты, у которых нет пары среди других открытых. Вернуть открытые карты без пары.
  // const openCardsWithoutPair = openCards.filter(card => {
  // Сравниваем открытые карточки с открытыми картами
  // const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
  // sameCards - открытые парные карточки
  // console.log(sameCards);
  // if (sameCards.length < 2) {
  // карточка без пары
  //   return true;
  // }
  // карта имеет пару
  //   return false;
  // });

  // если 2 карточки без пары - мы проиграли
  // const playerLost = openCardsWithoutPair.length >= 2;

  // "Игрок проиграл", т.к на поле есть две открытые карты без пары
  // if (playerLost) {
  //   finishGame(STATUS_LOST);
  //   return;
  // }

  // ... игра продолжается

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timer1}>
                <div className={styles.timerValue}>
                  <div className={styles.timerDescription}>min</div>
                  <div>{timer.minutes.toString().padStart("2", "0")}</div>
                </div>
                .
                <div className={styles.timerValue}>
                  <div className={styles.timerDescription}>sec</div>
                  <div>{timer.seconds.toString().padStart("2", "0")}</div>
                </div>
              </div>
              <div className={styles.alohomoraContent}>
                <h2 className={styles.title}>Суперсилы:</h2>
                <div className={styles.powers}>
                  <div className={cn(styles.alohomoraBack, styles.notActive)}>
                    <img className={styles.alohomoraImg} src={epiphany} alt="epiphany" />
                  </div>
                  <div className={styles.alohomoraText}>
                    "Прозрение" - на 5 секунд показываются все карты. Таймер длительности игры на это время
                    останавливается.
                  </div>
                  <div className={cn(styles.alohomoraBack, styles.notActive)}>
                    <img className={styles.alohomoraImg} src={alohomora} alt="alohomora" />
                  </div>
                  <div className={styles.alohomoraText}>"Алохомора" - открывает случайную пару карт</div>
                </div>
              </div>
              {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
            </>
          )}
        </div>

        <div className={styles.cards}>
          {cards.map(card => (
            <Card
              key={card.id}
              onClick={() => openCard(card)}
              open={status !== STATUS_IN_PROGRESS ? true : card.open}
              suit={card.suit}
              rank={card.rank}
            />
          ))}
        </div>
        {mode === "easy-mode" ? <div className={styles.mistakes}>Осталось {mistakes} ошибки</div> : ""}
        {/* <div className={styles.mistakes}>Осталось {mistakes} ошибки</div> */}

        {isGameEnded ? (
          <div className={styles.modalContainer}>
            <EndGameModal
              isWon={status === STATUS_WON}
              gameDurationSeconds={timer.seconds}
              gameDurationMinutes={timer.minutes}
              onClick={resetGame}
            />
          </div>
        ) : null}
        {/* {setIsEasyMode && <div className={styles.mistakes}>Осталось 3 ошибки</div>} */}
      </div>
    </div>
  );
}
