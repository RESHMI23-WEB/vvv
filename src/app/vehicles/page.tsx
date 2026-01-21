'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { vehicles, brands, vehicleTypes, fuelTypes } from '@/lib/data';
import type { Vehicle, VehicleType, FuelType } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { useComparison } from '@/hooks/use-comparison';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const maxPrice = Math.max(...vehicles.map((v) => v.price));

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const { addToComparison } = useComparison();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<VehicleType | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | 'all'>('all');

  useEffect(() => {
    const typeFromParams = searchParams.get('type') as VehicleType;
    if (typeFromParams && vehicleTypes.includes(typeFromParams)) {
      setSelectedType(typeFromParams);
    }
  }, [searchParams]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const searchMatch =
        search === '' ||
        vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase());
      const typeMatch =
        selectedType === 'all' || vehicle.type === selectedType;
      const brandMatch =
        selectedBrand === 'all' || vehicle.brand === selectedBrand;
      const priceMatch =
        vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
      const fuelMatch =
        selectedFuel === 'all' || vehicle.fuelType === selectedFuel;
      return searchMatch && typeMatch && brandMatch && priceMatch && fuelMatch;
    });
  }, [search, selectedType, selectedBrand, priceRange, selectedFuel]);
  
  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedBrand('all');
    setPriceRange([0, maxPrice]);
    setSelectedFuel('all');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by model or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={selectedType}
                  onValueChange={(v) => setSelectedType(v as VehicleType | 'all')}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Brand</label>
                <Select
                  value={selectedBrand}
                  onValueChange={(v) => setSelectedBrand(v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
               <div>
                <label className="text-sm font-medium">Fuel Type</label>
                <Select
                  value={selectedFuel}
                  onValueChange={(v) => setSelectedFuel(v as FuelType | 'all')}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Price Range
                </label>
                 <div className="text-sm text-muted-foreground mb-2">
                  ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                </div>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={10000}
                  value={[priceRange[1]]}
                  onValueChange={(value) => setPriceRange([0, value[0]])}
                />
              </div>

              <Button variant="ghost" onClick={resetFilters} className="w-full">
                <X className="mr-2 h-4 w-4" /> Reset Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAddToComparison={addToComparison}
                />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold">No Vehicles Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Clear Filters
                </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
