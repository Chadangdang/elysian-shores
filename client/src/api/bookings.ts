import client from './client';

export interface BookingPayload {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Booking {
  id: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function bookRoom(data: BookingPayload) {
  return client.post<Booking>('/bookings', data);
}
