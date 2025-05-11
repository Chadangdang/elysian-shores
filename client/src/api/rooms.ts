// client/src/api/rooms.ts
import client from "./client";

export interface RoomAvailabilityResponse {
  type_id:    string;
  type:       string;
  description:string;
  remaining:  number;
}

export interface RoomFilter {
  checkin:  string;  // “YYYY-MM-DD”
  checkout: string;
  guests:   number;
}

export const filterRooms = (filter: RoomFilter) =>
  client.post<RoomAvailabilityResponse[]>("/rooms/filter", filter);