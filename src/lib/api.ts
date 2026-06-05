const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // Surface misconfiguration early in dev rather than on first network call.
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. Quiz API calls will fail until you add it to .env.local."
  );
}

export type SessionStatus = "pending" | "started" | "completed" | "expired";

export interface CreateSessionResponse {
  session_id: string;
  status: SessionStatus;
  expires_at: string;
  tenant_id: string;
}

export interface QuizCardDef {
  card_id: string;
  topic_key: string;
  statement_key: string;
  text: string;
  answer_type: "boolean";
  required: boolean;
  order: number;
  version: number;
  mutually_exclusive_group?: string;
  multi_select_group?: string;
  redundancy_of?: string;
  is_flexibility_signal?: boolean;
  [key: string]: unknown;
}

export type NextCardStep =
  | "swipe_required"
  | "swipe_optional"
  | "city_picker"
  | "complete";

export interface NextCardResponse {
  done: boolean;
  step: NextCardStep;
  card?: QuizCardDef;
  progress?: {
    current: number;
    total: number;
    answered: number;
  };
}

// The swipe UI only decides the boolean (right = true, left = false) and which
// card it answered. The server derives tenant_id, topic_key, statement_key,
// card_version and the timestamps from the session + card definition.
export interface SwipeAnswer {
  session_id: string;
  card_id: string;
  answer: boolean;
  response_time_ms?: number;
}

export interface CompleteSessionResponse {
  confirmed: boolean;
  profile_completeness: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let detail: unknown = null;
    try {
      detail = await res.json();
    } catch {
      detail = await res.text().catch(() => null);
    }
    throw new ApiError(res.status, detail, `API ${res.status} on ${path}`);
  }

  // Some endpoints may return an empty body; guard against it.
  const text = await res.text();
  return (text ? JSON.parse(text) : (undefined as unknown)) as T;
}

export const quizApi = {
  createSession(email: string, triggerSource = "tenant_quiz") {
    return request<CreateSessionResponse>("/phase0/sessions/create", {
      method: "POST",
      body: JSON.stringify({ email, trigger_source: triggerSource }),
    });
  },

  getNextCard(sessionId: string) {
    return request<NextCardResponse>(
      `/next-card/${encodeURIComponent(sessionId)}`
    );
  },

  recordSwipe(answer: SwipeAnswer) {
    return request<{ status: string }>("/swipe", {
      method: "POST",
      body: JSON.stringify(answer),
    });
  },

  searchCities(q: string) {
    return request<string[]>(
      `/phase0/cities/search?q=${encodeURIComponent(q)}`
    );
  },

  recordCities(sessionId: string, cities: string[]) {
    return request<{ recorded: boolean; count: number }>(
      `/phase0/sessions/${encodeURIComponent(sessionId)}/cities`,
      {
        method: "POST",
        body: JSON.stringify({ cities }),
      }
    );
  },

  completeSession(sessionId: string) {
    return request<CompleteSessionResponse>(
      `/phase0/sessions/${encodeURIComponent(sessionId)}/complete`,
      { method: "POST" }
    );
  },
};
