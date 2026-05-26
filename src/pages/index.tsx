import QuizCard, { QuizQuestion } from "@/components/quiz/QuizCard";

const questions: QuizQuestion[] = [
  {
    id: "name",
    question: "What's your full name?",
    info: "We use this to address you in our follow-up emails.",
    placeholder: "e.g. Jane Doe",
  },
  {
    id: "city",
    question: "Which city are you searching in?",
    info: "Pick the Dutch city where you want to live.",
    placeholder: "e.g. Groningen",
  },
  {
    id: "budget",
    question: "What's your monthly budget (EUR)?",
    info: "All-in budget including utilities.",
    inputType: "number",
    placeholder: "e.g. 650",
  },
  {
    id: "about",
    question: "Tell us a bit about yourself",
    info: "Hobbies, study, lifestyle — anything that helps landlords match.",
    inputType: "textarea",
    placeholder: "I'm a 21-year-old student who...",
  },
];

export default function Home() {
  return (
    <section
      className="quiz-page py-120 lg-py-80"
      style={{ backgroundImage: "url(/assets/img/bg/7.webp)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="title-one text-center mb-50 lg-mb-30">
              <h3>
                Tenant <span>Quiz</span>
              </h3>
              <p className="fs-20">
                Answer a few questions so we can match you with the right home.
              </p>
            </div>
            <QuizCard
              questions={questions}
              onSubmit={(answers) => {
                console.log("Quiz answers:", answers);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
