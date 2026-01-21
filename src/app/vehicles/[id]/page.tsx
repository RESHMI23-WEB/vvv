'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { vehicles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/hooks/use-comparison';
import {
  Car,
  Fuel,
  Gauge,
  IndianRupee,
  Users,
  Weight,
  Plus,
  ArrowLeft,
  ChevronsRight
} from 'lucide-react';
import Link from 'next/link';

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const vehicle = vehicles.find((v) => v.id === params.id);
  const { addToComparison } = useComparison();

  if (!vehicle) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === vehicle.imageId);
  const specs = [
    { icon: IndianRupee, label: 'Price', value: `₹ ${vehicle.price.toLocaleString('en-IN')}` },
    { icon: Car, label: 'Engine', value: `${vehicle.engineCapacity} cc` },
    { icon: Gauge, label: 'Mileage', value: vehicle.fuelType === 'Electric' ? `${vehicle.mileage} km/charge` : `${vehicle.mileage} km/l` },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Users, label: 'Seating Capacity', value: `${vehicle.seatingCapacity} Seater` },
  ];
  if(vehicle.loadCapacity) {
    specs.push({ icon: Weight, label: 'Load Capacity', value: `${vehicle.loadCapacity.toLocaleString('en-IN')} kg` });
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button variant="ghost" asChild className='mb-4'>
        <Link href="/vehicles"><ArrowLeft className="mr-2 h-4 w-4" />Back to all vehicles</Link>
      </Button>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video w-full">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <span className="text-muted-foreground">No Image Available</span>
              </div>
            )}
             <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="text-lg py-1 px-3">{vehicle.type}</Badge>
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="p-0">
                <p className="text-muted-foreground">{vehicle.brand}</p>
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">
                  {vehicle.model}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 mt-6">
                 <p className="text-lg text-muted-foreground mb-6">This space is reserved for an interactive 3D model of the vehicle, allowing rotation, zoom, and pan controls for a fully immersive experience.</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3">
                      <spec.icon className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{spec.label}</p>
                        <p className="font-semibold">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => addToComparison(vehicle.id)}>
                <Plus className="mr-2 h-4 w-4" /> Add to Compare
              </Button>
               <Button size="lg" variant="outline" asChild>
                <Link href="/compare"><ChevronsRight className="mr-2 h-4 w-4" />Go to Comparison</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
