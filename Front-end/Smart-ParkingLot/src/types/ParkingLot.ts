export interface ParkingLot {
  id: number;
  adminEmail: string;
  name: string;
  nrSpots: number;
  price: number;
  latitude: number;
  longitude: number;
  parkingSpotsIds: number[];
}