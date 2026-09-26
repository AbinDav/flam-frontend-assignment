import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import './index.css'

function FlashCard({
  cards,
  currentIndex,
  setCurrentIndex,
  flipped,
  setFlipped
}) {

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="flashcard_wrapper">

      <button className='but_arrow'
        onClick={() => {
          setFlipped(false);
          setTimeout(() => { setCurrentIndex((prev) => Math.max(prev - 1, 0)) }, 200)

        }}
      >
        <MdKeyboardArrowLeft className="arrow_button" />

      </button>

      <div
        className={`flashcard_container ${flipped ? "flipped" : ""
          }`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard_inner">

          <div className="flashcard_front">
            <h2>{cards[currentIndex].question}</h2>
          </div>

          <div className="flashcard_back">
            <p>{cards[currentIndex].answer}</p>
          </div>

        </div>
      </div>

      <button className='but_arrow'
        onClick={() => {
          setFlipped(false)
          setTimeout(() => {
            setCurrentIndex((prev) =>
              Math.min(prev + 1, cards.length - 1)
            )
          },200)


        }}
      >
        <MdKeyboardArrowRight className="arrow_button" />
      </button>

    </div>
  );
}

export default FlashCard;