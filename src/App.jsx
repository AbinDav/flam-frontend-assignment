import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaSun, FaMoon } from "react-icons/fa";
import './App.css'
import FlashCard from "./components/flashcards";
import Error from "./components/ErrorContainer"
import Quiz from "./components/quiz";

function App() {

  const [error, setError] = useState(false)
  const [cards, setCards] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [input, setInput] = useState("")
  const [type, setType] = useState("flashcards")
  const [load, setLoad] = useState(false)
  const [dark, setDark] = useState(true)

  async function testBackend() {
    setLoad(true);
    setError(false);
    setCards([])
    setQuestions([])

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(true);
        return;
      }

      if (type === "flashcards") {
        setCards(data.result.cards);
      } else if (type === "quiz") {
        setQuestions(data.result.questions);
      }

      setCurrentIndex(0);
      setFlipped(false);

    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoad(false);
    }

  }


  return (
    <div className={`container ${dark ? "dark-container" : ""}`}>
      <div className="navbar">
        <div className="logo_text">
          <img className="image_logo" src="https://ml-eu.globenewswire.com/Resource/Download/b4ab117e-86be-4dd9-aaa6-dab2b2563cef" />
          <h1 className="study_text">Study Guide</h1>
        </div>
        <button onClick={() => setDark(!dark)} className="theme_button">
          {dark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="textarea_flash_flx">
        <div>
          <textarea
            className="topic_input"
            placeholder="Enter a topic or paste your study material..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="but_flx">
            <button
              className="generate_button"
              type="button"
              onClick={() => { testBackend() }}
              disabled={!input.trim()}
            >
              {load ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="40"
                  color="#ffffff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                />
              ) : (
                "Take Test!"
              )}
            </button>
            <select
              className="type_select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="flashcards">Flashcards</option>
              <option value="quiz">Quiz</option>
            </select>

          </div>
        </div>
        {
          error && <Error />
        }
        {!error && !load && type === "flashcards" && <FlashCard
          cards={cards}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          flipped={flipped}
          setFlipped={setFlipped}
        />
        }
        {!error && !load && type === "quiz" && <Quiz
          questions={questions}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />}
      </div>
      <div className="quiz_flx_center">
      </div>

    </div>
  )

}

export default App
