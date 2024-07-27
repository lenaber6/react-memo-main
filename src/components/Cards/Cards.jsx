import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { STATUS_IN_PROGRESS, STATUS_LOST, STATUS_PAUSED, STATUS_PREVIEW, STATUS_WON } from "../../const";
import { useParams } from "react-router-dom";
import alohomoraImg from "./images/alohomora1.png";
import epiphanyImg from "./images/epiphany.png";
import cn from "classnames";
import { useCheckbox } from "../../hooks/useCheckbox";

const alohomora = alohomoraImg;
const epiphany = epiphanyImg;

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { mode } = useParams();
  // console.log(mode);
  const { isEasyMode } = useCheckbox();

  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);

  // Игра в лёгком режиме до 3х ошибок
  const [mistakes, setMistakes] = useState(3);
  const [areCardsOpened, setAreCardsOpened] = useState(false);

  // Суперсилы: Прозрение- на 5 сек открыть все карты, Алахомора- открыть 2 одинаковые карты
  const [usedAlohomora, setUsedAlohomora] = useState(false);
  const [usedOnce, setUsedOnce] = useState(false);
  const [isEpiphanyAvailable, setIsEpiphanyAvailable] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  // const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  // const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function useEpiphany() {
    const currentTime = timer;
    handlePause();
    setTimeout(() => {
      handleResume();
    }, 5000); // 5 seconds
    setIsEpiphanyAvailable(false);
    const closedCards = cards.filter(card => !card.open);

    setCards(cards.map(card => ({ ...card, open: true })));

    setTimeout(() => {
      setCards(
        cards.map(card => {
          if (closedCards.includes(card)) {
            return { ...card, open: false };
          } else {
            return card;
          }
        }),
      );
      setTimer(currentTime);
    }, 5000);
  }

  function useAlohomora() {
    setUsedAlohomora(true);
  }
  useEffect(() => {
    if (usedAlohomora && !usedOnce) {
      const notOpenedCards = cards.filter(card => !card.open);
      const randomCard = notOpenedCards[Math.floor(Math.random() * notOpenedCards.length)];
      const randomPair = notOpenedCards.filter(
        sameCards => randomCard.suit === sameCards.suit && randomCard.rank === sameCards.rank,
      );
      randomPair[1].open = true;
      randomPair[0].open = true;
      setUsedOnce(true);
    }
  }, [cards, usedAlohomora, usedOnce]);

  // По умолчанию по окончании игры статус - LOST, его можно поменять на leaderboard

  function finishGame(status = STATUS_LOST) {
    setStatus(status);
  }
  function startGame() {
    setStatus(STATUS_IN_PROGRESS);
    setIsEpiphanyAvailable(true);
  }
  function resetGame() {
    setUsedAlohomora(false);
    setUsedOnce(false);
    setTimer({ seconds: 0, minutes: 0 });
    setStatus(STATUS_PREVIEW);
  }
  useEffect(() => {
    let interval = null;

    if (!isPaused && status === STATUS_IN_PROGRESS) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          const totalSeconds = prevTimer.minutes * 60 + prevTimer.seconds + 1;
          return {
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60,
          };
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPaused, status]);

  const handlePause = () => {
    setIsPaused(true);
    setPausedTime(Date.now());
  };

  const handleResume = () => {
    setIsPaused(false);
    const pauseDuration = Date.now() - pausedTime;
    setTimer(prevTimer => {
      const totalSeconds = prevTimer.minutes * 60 + prevTimer.seconds + Math.floor(pauseDuration / 1000);
      return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
      };
    });
  };
  const openCard = clickedCard => {
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

              {status === STATUS_IN_PROGRESS || status === STATUS_PAUSED ? (
                <div className={styles.superPowersContainer}>
                  <h2 className={styles.title}>Суперсилы:</h2>
                  <div className={styles.powers}>
                    <div
                      onClick={useEpiphany}
                      className={isEpiphanyAvailable ? styles.alohomoraBack : styles.notActive}
                    >
                      <img className={styles.alohomoraImg} src={epiphany} alt="epiphany" />
                    </div>
                    <div className={styles.alohomoraText}>
                      "Прозрение" - на 5 секунд показываются все карты. Таймер длительности игры на это время
                      останавливается.
                    </div>
                    <div
                      onClick={useAlohomora}
                      className={cn(styles.alohomoraBack, {
                        [styles.notActive]: usedAlohomora,
                      })}
                    >
                      <img className={styles.alohomoraImg} src={alohomora} alt="alohomora" />
                    </div>
                    <div className={styles.alohomoraText}>"Алохомора" - открывает случайную пару карт</div>
                  </div>
                </div>
              ) : null}

              {status === STATUS_IN_PROGRESS || status === STATUS_PAUSED ? (
                <Button onClick={resetGame}>Начать заново</Button>
              ) : null}
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
        {isEasyMode ? <div className={styles.mistakes}>Осталось {mistakes} ошибки</div> : ""}
        {isGameEnded ? (
          <div className={styles.modalContainer}>
            <EndGameModal
              usedOnce={usedOnce}
              isWon={status === STATUS_WON}
              gameDurationSeconds={timer.seconds}
              gameDurationMinutes={timer.minutes}
              onClick={resetGame}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
