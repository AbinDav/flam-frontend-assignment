import { useState } from "react";
import './index.css'

function Quiz({ questions, currentIndex, setCurrentIndex }) {
    if (questions.length === 0) {
        return null
    }
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [wrong, setWrong] = useState([]);
    const [ShowScoreCard, setShowScoreCard] = useState(false)
    console.log(questions)
    const [tempIndex, setTempIndex] = useState(
        questions.map((_, index) => index)
    );
    const handleSubmit = () => {
        if (selectedAnswer === null) {
            return;
        }

        if (selectedAnswer === questions[tempIndex[currentIndex]].answer) {
            console.log("Correct!");
        } else {
            console.log("Wrong!");

            setWrong((prev) => [...prev, tempIndex[currentIndex]]);
        }

        setSelectedAnswer(null);

        setCurrentIndex((prev) =>
            Math.min(prev + 1, tempIndex.length - 1)
        );
        if (currentIndex === tempIndex.length - 1) {
            setShowScoreCard(true)
        }
    };

    function onclickAttemptAgain() {
        if (wrong.length===0) {
            return
        }
        setShowScoreCard(false);
        setTempIndex(wrong);
        setCurrentIndex(0);
        setWrong([]);

    }

    const ScroeCard = () => {
        return (
            <div className="scorecard">
                <h1 className="your_score">Your Score</h1>

                <div className="scorecard_text">
                    <h1>{tempIndex.length - wrong.length}</h1>
                    <h1>/</h1>
                    <h1>{tempIndex.length}</h1>
                </div>
                <button
                    disabled={wrong.length === 0}
                    onClick={onclickAttemptAgain}
                    className="generate_button"
                >
                    {wrong.length === 0 ? "You Got It" : "Attempt Again"}
                </button>            </div>
        )
    }
    const Mcq = () => {
        return (
            <div className="quiz_container">
                <div className="quiz_header">
                    <span className="quiz_label">QUIZ</span>
                    <span className="quiz_progress">
                        Question {currentIndex + 1} / {tempIndex.length}
                    </span>
                </div>

                <h2 className="quiz_question">
                    {questions[tempIndex[currentIndex]].question}
                </h2>

                <div className="quiz_options">
                    {questions[tempIndex[currentIndex]].options.map((option, index) => (
                        <label
                            key={index}
                            className={`quiz_option ${selectedAnswer === index ? "selected" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => setSelectedAnswer(index)}
                            />

                            <span className="option_text">{option}</span>
                        </label>
                    ))}
                </div>

                <button
                    className="quiz_submit"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                >
                    Submit Answer
                </button>
            </div>
        );
    }
    return (
        <>
            {!ShowScoreCard && <Mcq />}
            {ShowScoreCard && <ScroeCard />}
        </>
    )

}

export default Quiz