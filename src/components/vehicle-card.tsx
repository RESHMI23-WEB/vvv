import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fuel, Gauge, IndianRupee, Users, Plus } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface VehicleCardProps {
  vehicle: Vehicle;
  onAddToComparison: (vehicleId: string) => void;
}

export default function VehicleCard({ vehicle, onAddToComparison }: VehicleCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === vehicle.imageId);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/vehicles/${vehicle.id}`} className="block">
          <div className="aspect-video relative">
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
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <Link href={`/vehicles/${vehicle.id}`}>
              <CardTitle className="text-lg font-bold leading-tight hover:text-primary">
                {vehicle.brand} {vehicle.model}
              </CardTitle>
            </Link>
           <Badge variant="secondary">{vehicle.type}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-accent-foreground" />
            <span>{vehicle.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-accent-foreground" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-accent-foreground" />
            <span>
              {vehicle.fuelType === 'Electric' ? `${vehicle.mileage} km/charge` : `${vehicle.mileage} km/l`}
            </span>
          </div>
           <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-foreground" />
            <span>{vehicle.seatingCapacity} Seater</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAddToComparison(vehicle.id)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add to Compare
        </Button>
      </CardFooter>
    </Card>
  );
}
