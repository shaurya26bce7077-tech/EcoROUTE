export type ConsumerProfile = {
  id: string;
  consumer_id: string;
  name: string;
  reliability_score: number;
  total_claims: number;
  successful_pickups: number;
  no_shows: number;
};

const STORAGE_KEY = "ecoroute_consumer_id";

export function getConsumerId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `consumer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function getReliabilityLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Low reliability";
}
