'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { vehicles } from '@/lib/data';
import Link from 'next/link';
import type { Vehicle } from '@/lib/types';
import { getVehicleRecommendations } from '@/ai/ai-vehicle-recommendations';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Recommendation = {
  vehicle: Vehicle;
  reason: string;
};

export default function AIRecommendationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setRecommendation(null);
    setError(null);
    try {
      const vehicleList = vehicles.map((v) => `${v.brand} ${v.model}`).join(', ');

      const result = await getVehicleRecommendations({
        preferences: prompt,
        availableVehicles: vehicleList,
      });

      const { brand, model, reason } = result.recommendation;
      const foundVehicle = vehicles.find(
        (v) =>
          v.brand.toLowerCase() === brand.toLowerCase() &&
          v.model.toLowerCase() === model.toLowerCase()
      );

      if (foundVehicle) {
        setRecommendation({ vehicle: foundVehicle, reason });
      } else {
        console.warn(`AI recommended a vehicle not in the list: ${brand} ${model}`);
        throw new Error(`AI recommended an unavailable vehicle.`);
      }
    } catch (e) {
      console.error(e);
      setError('Sorry, an error occurred while generating your recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetDialogState = () => {
    setPrompt('');
    setRecommendation(null);
    setError(null);
    setIsLoading(false);
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetDialogState();
    }
  };
  
  const startOver = () => {
      setRecommendation(null);
      setError(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <Sparkles className="mr-2 h-4 w-4" /> Get AI Recommendation
        </Button>
      </DialogTrigger>
      {isClient && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Vehicle Recommendation</DialogTitle>
            <DialogDescription>
              Describe your needs, and our AI will suggest the perfect vehicle for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="prompt">What are you looking for in a vehicle?</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., 'I need a family-friendly SUV with good mileage for city driving and occasional long trips.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isLoading || !!recommendation || !!error}
              />
            </div>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Sparkles className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-4">Finding your vehicle...</span>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {recommendation && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    We recommend the {recommendation.vehicle.brand}{' '}
                    {recommendation.vehicle.model}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {recommendation.reason}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={`/vehicles/${recommendation.vehicle.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
             {!isLoading && !recommendation && !error && (
                <Button onClick={handleGenerate} disabled={!prompt}>
                    Generate Recommendation
                </Button>
            )}
             {!isLoading && (recommendation || error) && (
                <Button variant="secondary" onClick={startOver}>
                    Start Over
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
