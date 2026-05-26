"use client";

import { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import StepsBar from "@/components/steps/stepsBar";
import { useMultiStep } from "@/components/steps/useMultiStep";

export interface QuizQuestion {
  id: string;
  question: string;
  info?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "number" | "textarea";
}

interface QuizCardProps {
  questions: QuizQuestion[];
  onSubmit?: (answers: Record<string, string>) => void;
}

const QuizCard = ({ questions, onSubmit }: QuizCardProps) => {
  const { currentStep, step, next, back, isFirst, isLast } =
    useMultiStep(questions);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<"forward" | "backward" | null>(
    null
  );
  const lastStepRef = useRef(currentStep);

  useEffect(() => {
    const last = lastStepRef.current;
    if (currentStep > last) setDirection("forward");
    else if (currentStep < last) setDirection("backward");
    lastStepRef.current = currentStep;
  }, [currentStep]);

  const updateAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleNext = () => {
    if (isLast) {
      onSubmit?.(answers);
      return;
    }
    next();
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-wrapper__header d-flex justify-content-between align-items-center mb-20">
        <StepsBar
          steps={questions.map((q) => q.id)}
          currentStep={currentStep}
        />
        {step?.info ? (
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip id={`info-${step.id}`}>{step.info}</Tooltip>}
          >
            <button
              type="button"
              aria-label="More information"
              className="quiz-wrapper__info-btn"
            >
              <i className="fa-regular fa-circle-info"></i>
            </button>
          </OverlayTrigger>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      <div className="quiz-wrapper__row d-flex align-items-center gap-3">
        <button
          type="button"
          className="quiz-wrapper__arrow"
          onClick={back}
          disabled={isFirst}
          aria-label="Previous question"
        >
          <i className="fa-regular fa-chevron-left"></i>
        </button>

        <div className="quiz-card bg-white border rounded-3 flex-grow-1">
          <div className="list-room-step-transition">
            <div
              key={currentStep}
              className={`list-room-step-transition__inner ${
                direction === "forward"
                  ? "list-room-step-transition__inner--forward"
                  : direction === "backward"
                  ? "list-room-step-transition__inner--backward"
                  : ""
              }`}
            >
              <div className="input-group-meta form-group">
                <label
                  htmlFor={`quiz-${step.id}`}
                  className="d-block fs-22 fw-500 mb-20"
                >
                  {step.question}
                </label>
                {step.inputType === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    id={`quiz-${step.id}`}
                    rows={4}
                    value={answers[step.id] ?? ""}
                    placeholder={step.placeholder}
                    onChange={(e) => updateAnswer(step.id, e.target.value)}
                  />
                ) : (
                  <Form.Control
                    id={`quiz-${step.id}`}
                    type={step.inputType ?? "text"}
                    value={answers[step.id] ?? ""}
                    placeholder={step.placeholder}
                    onChange={(e) => updateAnswer(step.id, e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="quiz-wrapper__arrow"
          onClick={handleNext}
          aria-label={isLast ? "Submit quiz" : "Next question"}
        >
          <i
            className={`fa-regular ${
              isLast ? "fa-check" : "fa-chevron-right"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
