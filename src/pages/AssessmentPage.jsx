import { useEffect, useState } from "react";
import ProgressBar from "../components/Assessment/ProgressBar";
import AssessmentQuestion from "../components/Assessment/AssessmentQuestion";
import AptitudeQuestion from "../components/Assessment/AptitudeQuestion";
import CompletionModal from "../components/Assessment/CompletionModal";
import InterestInstructions from "../components/Assessment/InterestInstructions";
import RIASECCompletionModal from "../components/Assessment/RIASECCompletionModal";
import AptitudeInstructions from "../components/Assessment/AptitudeInstructions";
import OceanInstructions from "../components/Assessment/OceanInstructions"; // NEW
import {
  fetchAssessmentQuestions,
  submitScores,
} from "../services/assessmentService";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage.util";
import {
  completeUserProgress,
  fetchUserProgress,
  startUserProgress,
  updateUserProgress,
} from "../services/userAssessmentProgressService";

import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function AssessmentPage() {

  const navigation = useNavigate();
  // TODO: dynamic from auth
  const [assessmentType, setAssessmentType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(
    getFromLocalStorage("assessment_answers") || {}
  );
  const [loading, setLoading] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showInterestInstructions, setShowInterestInstructions] =
    useState(false);
  const [showRiasecCompletionModal, setShowRiasecCompletionModal] =
    useState(false);
  const [showAptitudeInstructions, setShowAptitudeInstructions] =
    useState(false);
  const [showOceanInstructions, setShowOceanInstructions] = useState(false); // NEW

  useEffect(() => {
    fetchUserProgress()
      .then((progress) => {
        if (!progress) {
          startUserProgress("OCEAN").then((p) => {
            setAssessmentType(p.currentStage);
            setShowOceanInstructions(true);
          });
        } else {
          setAssessmentType(progress.currentStage || "COMPLETED");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch progress", err);
      });
  }, []);

  useEffect(() => {
    if (assessmentType === "COMPLETED" || assessmentType === null) return;

    setLoading(true);
    fetchAssessmentQuestions(assessmentType)
      .then((data) => {
        let formatted;
        if (assessmentType === "APTITUDE") {
          formatted = data.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options || [],
            trait: q.trait,
            order: q.order,
          }));
        } else {

          formatted = data.flatMap((trait) =>
            console.log(trait) ||
            trait.questions
              .sort((a, b) => a.order - b.order)
              .map((q) => ({
                id: q.id,
                text: q.text,
                reverse: q.reverse,
                trait: {
                  id: trait.id,
                  code: trait.code,
                  name: trait.name,
                },
                order: q.order,
              }))
          );
        }

        setQuestions(formatted);
        setCurrent(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        setLoading(false);
      });
  }, [assessmentType]);

  const handleAnswer = (questionId, value) => {
      const updated = { ...answers, [questionId]: value };
      setAnswers(updated);
      saveToLocalStorage("assessment_answers", updated);
 

  };

  const calculateScores = () => {
    if (assessmentType === "APTITUDE") {
      let scoreMap = {};
      for (const q of questions) {
        const selectedOption = q.options.find(
          (opt) => opt.id === answers[q.id]
        );
        const isCorrect = selectedOption?.isCorrect || false;
        scoreMap[q.trait.code] =
          (scoreMap[q.trait.code] || 0) + (isCorrect ? 1 : 0);
      }
      return Object.entries(scoreMap).map(([code, score]) => ({
        assessmentType,
        traitOrCategoryCode: code,
        score,
      }));
    } else {
      let scoreMap = {};
      for (const q of questions) {
        const val = answers[q.id];
        if (val == null) continue;
        const adjustedScore = q.reverse ? 6 - val : val;
        scoreMap[q.trait.code] =
          (scoreMap[q.trait.code] || 0) + adjustedScore;
      }
      return Object.entries(scoreMap).map(([code, score]) => ({
        assessmentType,
        traitOrCategoryCode: code,
        score: Math.round(score),
      }));
    }
  };

  const submitScoresToAPI = async () => {
    const scores = calculateScores();
    try {
      await submitScores(scores);
      console.log(`${assessmentType} scores submitted`, scores);
    } catch (err) {
      console.error("Failed to submit scores:", err);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const finishAssessment = async () => {
    await submitScoresToAPI();
    saveToLocalStorage("assessment_answers", {});

    if (assessmentType === "OCEAN") {
      setShowCompletionModal(true);
      await updateUserProgress("RIASEC");
    } else if (assessmentType === "RIASEC") {
      setShowRiasecCompletionModal(true);
      await updateUserProgress("APTITUDE");
    } else {
      await completeUserProgress();
      setAssessmentType("COMPLETED");
    }
  };

  // Handlers for modals and instructions
  const startInterestTest = () => {
    setShowCompletionModal(false);
    setShowInterestInstructions(true);
  };

  const beginRiasecTest = () => {
    setShowInterestInstructions(false);
    setAssessmentType("RIASEC");
    saveToLocalStorage("assessment_type", "RIASEC");
    setAnswers({});
  };

  const startAptitudeTest = () => {
    setShowAptitudeInstructions(false);
    setAssessmentType("APTITUDE");
    saveToLocalStorage("assessment_type", "APTITUDE");
    setAnswers({});
  };

  const beginAptitudeInstructions = () => {
    setShowRiasecCompletionModal(false);
    setShowAptitudeInstructions(true);
  };

  const currentQuestion = questions[current];
  const isEnd = current === questions.length - 1;

  // Redirect to report if done
  if (assessmentType === "COMPLETED") {
    navigation("/report");
  }

  // Show Ocean Instructions first
  if (showOceanInstructions && assessmentType === "OCEAN") {
    return <OceanInstructions onStart={() => setShowOceanInstructions(false)} />;
  }

  if (showInterestInstructions) {
    return <InterestInstructions onStart={beginRiasecTest} />;
  }

  if (showAptitudeInstructions) {
    return <AptitudeInstructions onStart={startAptitudeTest} />;
  }

  if (loading) return <p className="text-center mt-8">Loading questions...</p>;

  return (
    <div className="p-6 w-full max-w-7xl mx-auto flex flex-col min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900">
          {assessmentType === "OCEAN"
            ? "Welcome to Personality Assessment"
            : assessmentType === "RIASEC"
              ? "RIASEC Career Interest Test"
              : "Aptitude Test"}
        </h1>
        <p className="mt-2 text-lg">
          Question <strong>{current + 1} / {questions.length}</strong>
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-10 flex flex-col flex-1">
        <ProgressBar current={current + 1} total={questions.length} />
        <div className="flex-1 flex flex-col">
          {currentQuestion &&
            (assessmentType === "APTITUDE" ? (
              <AptitudeQuestion
                data={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(val) => handleAnswer(currentQuestion.id, val)}
              />
            ) : (
              <AssessmentQuestion
                data={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(val) => handleAnswer(currentQuestion.id, val)}
                nextQuestion={nextQuestion}
              />
            ))}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="mr-2 px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Prev
          </button>
          {!isEnd ? (
            <button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion?.id]}
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              Next
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              onClick={finishAssessment}
              disabled={!answers[currentQuestion?.id]}
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              Finish <span className="ml-2" role="img" aria-label="thumbs up">👍</span>
            </button>
          )}
        </div>
      </div>

      {showCompletionModal && (
        <CompletionModal onClose={startInterestTest} />
      )}
      {showRiasecCompletionModal && (
        <RIASECCompletionModal onClose={beginAptitudeInstructions} />
      )}
    </div>
  );
}
