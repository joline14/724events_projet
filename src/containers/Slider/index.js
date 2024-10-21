import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
  
  useEffect(() => {
    // Timer pour changer d'index toutes les 5s
    const timer = setTimeout(() => {
     // Incrémente l'index ou le remet à 0 si la fin est atteinte
     setIndex((prevIndex) => (prevIndex < (byDateDesc?.length ?? 0) - 1 ? prevIndex + 1 : 0));
    }, 5000);
    // Nettoyage du timer lorsque le composant est démonté ou que l'index change
    return () => clearTimeout(timer);
     // Effet relancé quand `index` ou `byDateDesc` change
  }, [index, byDateDesc]);
  
  // Gestion du changement via les boutons radio
  const handleRadioChange = (radioIdx) => {
    setIndex(radioIdx);
      // Annulation du timer de transition automatique
      clearTimeout();
  };
  
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((e, radioIdx) => (
                <input
                  key={`${e.title}`}
                  type="radio"
                  name="radio-button"
                  checked={radioIdx === index}
                   onChange={() => handleRadioChange(radioIdx)} // Utilisation de onChange pour changer de page
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
