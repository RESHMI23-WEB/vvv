import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Truck, Bike, IndianRupee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AIRecommendationDialog from '@/components/ai-recommendation-dialog';

const categories: {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    name: 'Two Wheelers',
    href: '/vehicles?type=Two+Wheeler',
    icon: Bike,
    description: 'Motorcycles and scooters for personal mobility.',
  },
  {
    name: 'Three Wheelers',
    href: '/vehicles?type=Three+Wheeler',
    icon: Car, // Using Car as a proxy
    description: 'Auto-rickshaws and cargo carriers for city transport.',
  },
  {
    name: 'Four Wheelers',
    href: '/vehicles?type=Four+Wheeler',
    icon: Car,
    description: 'A wide range of cars, from hatchbacks to SUVs.',
  },
  {
    name: 'Six Wheelers',
    href: '/vehicles?type=Six+Wheeler',
    icon: Truck,
    description: 'Heavy-duty trucks and commercial vehicles.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] text-primary-foreground">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black/50 p-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl font-headline">
            Virtual Vehicle Showcase
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Explore, compare, and visualize your next vehicle in stunning
            detail.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/vehicles">Browse All Vehicles</Link>
            </Button>
            <AIRecommendationDialog />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
              Find Your Perfect Ride
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Whatever your needs, we have a category for you. Start exploring
              by selecting a vehicle type below.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link href={category.href} key={category.name} className="group">
                <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                  <CardHeader className="flex-row items-center gap-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl font-semibold">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
