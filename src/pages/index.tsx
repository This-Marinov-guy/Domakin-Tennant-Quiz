import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import ErrorPage from "@/components/error";
import SwipeCard from "@/components/quiz/SwipeCard";
import { NextCardResponse, SwipeAnswer, quizApi } from "@/lib/api";

type LoadState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "ready"; data: NextCardResponse };

const ACTIVE_SESSION_STORAGE_KEY = "domakin_tenant_quiz_active_session_id";

function getProgressLabel(data: NextCardResponse) {
  if (!data.progress) {
    return "Question";
  }

  return `Question ${data.progress.current} of ${data.progress.total}`;
}

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [submitting, setSubmitting] = useState(false);
  // When the current card was shown — used for response_time_ms / shown_at.
  const shownAt = useRef<string>(new Date().toISOString());

  const sessionId =
    typeof router.query.session_id === "string" ? router.query.session_id : "";

  const load = useCallback((sid: string) => {
    setState({ kind: "loading" });
    quizApi
      .getNextCard(sid)
      .then((data) => {
        window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, sid);
        shownAt.current = new Date().toISOString();
        setState({ kind: "ready", data });
      })
      // Missing/expired sessions (a 404 from the API) — or any unreachable
      // state — render as 404 so the UX matches what users expect from bad links.
      .catch(() => {
        if (
          window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) === sid
        ) {
          window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
        }
        setState({ kind: "not_found" });
      });
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    if (!sessionId) {
      const storedSessionId = window.localStorage.getItem(
        ACTIVE_SESSION_STORAGE_KEY
      );

      if (storedSessionId) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, session_id: storedSessionId },
          },
          undefined,
          { shallow: true }
        );
        return;
      }

      setState({ kind: "not_found" });
      return;
    }

    load(sessionId);
  }, [router, router.isReady, sessionId, load]);

  const handleSwipe = useCallback(
    (answer: boolean) => {
      if (state.kind !== "ready" || !state.data.card || !sessionId) return;
      if (submitting) return;

      const card = state.data.card;
      const payload: SwipeAnswer = {
        session_id: sessionId,
        card_id: card.card_id,
        answer,
        response_time_ms: Math.max(
          0,
          Date.now() - new Date(shownAt.current).getTime()
        ),
      };

      setSubmitting(true);
      quizApi
        .recordSwipe(payload)
        .catch(() => {
          // Best effort: even if recording hiccups, re-syncing with the server
          // keeps the user on the correct next card.
        })
        .finally(() => {
          setSubmitting(false);
          load(sessionId);
        });
    },
    [state, sessionId, submitting, load]
  );

  if (state.kind === "not_found") {
    return (
      <>
        <Head>
          <title>404 - Domakin Tennat Quiz</title>
        </Head>
        <ErrorPage />
      </>
    );
  }

  const card = state.kind === "ready" ? state.data.card : undefined;
  const step = state.kind === "ready" ? state.data.step : "";
  const progressLabel =
    state.kind === "ready" ? getProgressLabel(state.data) : "Question";

  return (
    <>
      <Head>
        <title>Tenant Quiz - Domakin</title>
      </Head>
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
                  Swipe right for <strong>yes</strong>, left for{" "}
                  <strong>no</strong> to help us match you with the right home.
                </p>
              </div>

              {state.kind === "loading" ? (
                <div className="swipe-card-frame swipe-card-frame--loading">
                  <div className="swipe-card-slot d-flex align-items-center justify-content-center">
                    <span className="quiz-spinner" aria-hidden="true" />
                    <span className="visually-hidden">Loading next question</span>
                  </div>
                  <div className="swipe-card__actions swipe-card__actions--placeholder" />
                </div>
              ) : card ? (
                <SwipeCard
                  key={card.card_id}
                  progressLabel={progressLabel}
                  text={card.text}
                  onSwipe={handleSwipe}
                  disabled={submitting}
                />
              ) : (
                <div className="quiz-card bg-white border rounded-3 text-center">
                  <p className="fs-22 fw-500 m0">
                    All cards answered — next step: {step.replace(/_/g, " ")}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
