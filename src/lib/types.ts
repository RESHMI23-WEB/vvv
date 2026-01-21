export type VehicleType = 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler' | 'Six Wheeler';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  type: VehicleType;
  engineCapacity: number; // in CC
  mileage: number; // in km/l or km/charge
  fuelType: FuelType;
  price: number; // in INR
  seatingCapacity: number;
  loadCapacity?: number; // in kg
  imageId: string;
}
