export type ListingStatus = "available" | "reserved" | "picked_up" | "expired";

export interface Listing {
  id: string;
  store_name: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  is_free: boolean;
  price: number | null;
  address: string;
  lat: number;
  lng: number;
  expiry_time: string;
  pickup_window: string;
  status: ListingStatus;
  created_at: string;
}

export type ClaimStatus = "reserved" | "picked_up" | "cancelled" | "no_show";

export interface Claim {
  id: string;
  listing_id: string;
  consumer_id: string;
  consumer_name: string;
  status: ClaimStatus;
  claimed_at: string;
}

export interface ConsumerProfile {
  id: string;
  consumer_id: string;
  name: string;
  reliability_score: number;
  total_claims: number;
  successful_pickups: number;
  no_shows: number;
  created_at?: string;
  updated_at?: string;
}
