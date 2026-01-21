'use client';
import { useMemo } from 'react';
import { useComparison } from '@/hooks/use-comparison';
import { vehicles } from '@/lib/data';
import type { Vehicle } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy, Car, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

type ComparisonResult = {
  bestVehicle: Vehicle | null;
  scores: Record<string, number>;
};

function highlightBest(
  values: (number | undefined)[],
  lowerIsBetter: boolean = false
) {
  const validValues = values.filter((v) => v !== undefined) as number[];
  if (validValues.length < 2) return values.map(() => false);

  const bestValue = lowerIsBetter ? Math.min(...validValues) : Math.max(...validValues);
  return values.map((v) => v === bestValue);
}

export default function ComparePage() {
  const { comparison, removeFromComparison, clearComparison } = useComparison();

  const comparedVehicles = useMemo(
    () => vehicles.filter((v) => comparison.includes(v.id)),
    [comparison]
  );

  const comparisonResult: ComparisonResult = useMemo(() => {
    if (comparedVehicles.length < 2) {
      return { bestVehicle: null, scores: {} };
    }

    const scores: Record<string, number> = Object.fromEntries(
      comparedVehicles.map((v) => [v.id, 0])
    );

    const prices = comparedVehicles.map((v) => v.price);
    const priceHighlights = highlightBest(prices, true);
    priceHighlights.forEach((isBest, i) => {
      if (isBest) scores[comparedVehicles[i].id]++;
    });

    const mileages = comparedVehicles.map((v) => v.mileage);
    const mileageHighlights = highlightBest(mileages);
    mileageHighlights.forEach((isBest, i) => {
      if (isBest) scores[comparedVehicles[i].id]++;
    });

    const engines = comparedVehicles.map((v) => v.engineCapacity);
    const engineHighlights = highlightBest(engines);
    engineHighlights.forEach((isBest, i) => {
      if (isBest) scores[comparedVehicles[i].id]++;
    });

    const seating = comparedVehicles.map((v) => v.seatingCapacity);
    const seatingHighlights = highlightBest(seating);
    seatingHighlights.forEach((isBest, i) => {
      if (isBest) scores[comparedVehicles[i].id]++;
    });

    const loadCapacities = comparedVehicles.map((v) => v.loadCapacity);
    if(loadCapacities.some(c => c !== undefined)){
      const loadCapacityHighlights = highlightBest(loadCapacities);
      loadCapacityHighlights.forEach((isBest, i) => {
        if (isBest) scores[comparedVehicles[i].id]++;
      });
    }

    let maxScore = -1;
    let bestVehicleId: string | null = null;
    for (const vehicleId in scores) {
      if (scores[vehicleId] > maxScore) {
        maxScore = scores[vehicleId];
        bestVehicleId = vehicleId;
      }
    }

    return {
      bestVehicle: vehicles.find((v) => v.id === bestVehicleId) || null,
      scores,
    };
  }, [comparedVehicles]);

  const specs = [
    { key: 'price', label: 'Price', format: (v: number) => `₹ ${v.toLocaleString('en-IN')}`, lowerIsBetter: true },
    { key: 'mileage', label: 'Mileage', format: (v: number, veh: Vehicle) => veh.fuelType === 'Electric' ? `${v} km/charge` : `${v} km/l` },
    { key: 'engineCapacity', label: 'Engine Capacity', format: (v: number) => `${v} cc` },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'seatingCapacity', label: 'Seating Capacity', format: (v: number) => `${v} Seater` },
    { key: 'loadCapacity', label: 'Load Capacity', format: (v: number) => v ? `${v.toLocaleString('en-IN')} kg` : 'N/A' },
  ];
  
  const hasCommercialVehicles = comparedVehicles.some(v => v.loadCapacity);
  const displayedSpecs = hasCommercialVehicles ? specs : specs.filter(s => s.key !== 'loadCapacity');

  if (comparedVehicles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Car className="mx-auto h-24 w-24 text-muted-foreground/30" />
        <h1 className="mt-4 text-3xl font-bold font-headline">Your Comparison List is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add some vehicles to compare them side-by-side.</p>
        <Button asChild className="mt-6">
          <Link href="/vehicles"><Plus className="mr-2 h-4 w-4" /> Browse Vehicles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Vehicle Comparison</h1>
        {comparison.length > 0 && 
            <Button variant="destructive" onClick={clearComparison}>
                <Trash2 className="mr-2 h-4 w-4"/> Clear All
            </Button>
        }
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold text-lg">Feature</TableHead>
              {comparedVehicles.map((vehicle) => {
                const image = PlaceHolderImages.find((img) => img.id === vehicle.imageId);
                return (
                  <TableHead key={vehicle.id} className="w-[250px] text-center">
                    <div className="relative group">
                      <div className="relative aspect-video mb-2 rounded-md overflow-hidden">
                        {image ? (
                           <Image
                            src={image.imageUrl}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover"
                          />
                        ) : <div className="bg-muted h-full w-full"/>}
                      </div>
                      <Link href={`/vehicles/${vehicle.id}`} className="font-semibold text-base hover:text-primary">
                        {vehicle.brand} {vehicle.model}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-background group-hover:opacity-100 opacity-50 transition-opacity"
                        onClick={() => removeFromComparison(vehicle.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                );
              })}
              {comparedVehicles.length < 4 && (
                <TableHead className="w-[250px]">
                  <div className="flex items-center justify-center h-full aspect-video border-2 border-dashed rounded-md">
                    <Button variant="outline" asChild>
                       <Link href="/vehicles"><Plus className="mr-2 h-4 w-4" />Add Vehicle</Link>
                    </Button>
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSpecs.map((spec) => {
               const values = comparedVehicles.map(v => v[spec.key as keyof Vehicle] as number | undefined);
               const highlights = spec.format && typeof values[0] === 'number' ? highlightBest(values, spec.lowerIsBetter) : [];
              return (
              <TableRow key={spec.label}>
                <TableCell className="font-medium">{spec.label}</TableCell>
                {comparedVehicles.map((vehicle, i) => (
                  <TableCell key={vehicle.id} className={`text-center ${highlights[i] ? 'bg-green-100 dark:bg-green-900/30' : ''}`}>
                    {spec.format ? spec.format(vehicle[spec.key as keyof Vehicle] as number, vehicle) : vehicle[spec.key as keyof Vehicle]}
                  </TableCell>
                ))}
                 {comparedVehicles.length < 4 && <TableCell />}
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

       {comparisonResult.bestVehicle && (
        <Card className="mt-12 bg-primary/5">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Our Recommendation
            </CardTitle>
            <CardDescription>Based on the selected attributes, here's our suggested winner.</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold">{comparisonResult.bestVehicle.brand} {comparisonResult.bestVehicle.model}</h3>
            <p className="text-muted-foreground mt-1">This vehicle scored highest in our comparison, excelling in {comparisonResult.scores[comparisonResult.bestVehicle.id]} categories.</p>
             <Button asChild className="mt-4">
                <Link href={`/vehicles/${comparisonResult.bestVehicle.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
