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
const SESSION_PROGRESS_STORAGE_PREFIX = "domakin_tenant_quiz_progress:";

type StoredProgress = NonNullable<NextCardResponse["progress"]>;
type NextCardResponseWithProgress = NextCardResponse & {
  progress: StoredProgress;
};

function getProgressStorageKey(sessionId: string) {
  return `${SESSION_PROGRESS_STORAGE_PREFIX}${sessionId}`;
}

function readStoredProgress(sessionId: string): StoredProgress | undefined {
  if (!sessionId) return undefined;

  try {
    const raw = window.localStorage.getItem(getProgressStorageKey(sessionId));
    if (!raw) return undefined;

    const progress = JSON.parse(raw) as Partial<StoredProgress>;
    if (
      typeof progress.current === "number" &&
      typeof progress.total === "number" &&
      typeof progress.answered === "number"
    ) {
      return progress as StoredProgress;
    }
  } catch {
    window.localStorage.removeItem(getProgressStorageKey(sessionId));
  }

  return undefined;
}

function saveStoredProgress(sessionId: string, progress: StoredProgress) {
  if (!sessionId) return;
  window.localStorage.setItem(
    getProgressStorageKey(sessionId),
    JSON.stringify(progress)
  );
}

function getProgressPercent(data: NextCardResponse, sessionId: string) {
  const progress = data.progress ?? readStoredProgress(sessionId);

  if (!progress || progress.total <= 0) {
    return 0;
  }

  return Math.round((progress.current / progress.total) * 100);
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
      .then(async (data): Promise<NextCardResponseWithProgress> => {
        if (data.progress) {
          return { ...data, progress: data.progress };
        }

        const { progress } = await quizApi.getSessionProgress(sid);
        return { ...data, progress };
      })
      .then((data) => {
        window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, sid);
        saveStoredProgress(sid, data.progress);
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
        window.localStorage.removeItem(getProgressStorageKey(sid));
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
          const currentProgress =
            state.data.progress ?? readStoredProgress(sessionId);

          if (currentProgress) {
            saveStoredProgress(sessionId, {
              ...currentProgress,
              answered: Math.min(
                currentProgress.answered + 1,
                currentProgress.total
              ),
              current: Math.min(
                currentProgress.current + 1,
                currentProgress.total
              ),
            });
          }

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
  const progressPercent =
    state.kind === "ready" ? getProgressPercent(state.data, sessionId) : 0;

  return (
    <>
      <Head>
        <title>Tenant Quiz - Domakin</title>
        <meta
          name="description"
          content="Take the Domakin tenant quiz — swipe right for yes, left for no — so we can match you with the right home in the Netherlands."
        />

        {/* Open Graph (link previews on social / messaging apps) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Domakin" />
        <meta property="og:title" content="Tenant Quiz - Domakin" />
        <meta
          property="og:description"
          content="Swipe right for yes, left for no to help us match you with the right home."
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Tenant Quiz - Domakin" />
        <meta
          name="twitter:description"
          content="Swipe right for yes, left for no to help us match you with the right home."
        />
        <meta name="twitter:image" content="/android-chrome-512x512.png" />
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
                  progressPercent={progressPercent}
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
