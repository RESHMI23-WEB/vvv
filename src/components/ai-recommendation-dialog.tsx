'use client';

import { useState } from 'react';
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
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { vehicles } from '@/lib/data';
import Link from 'next/link';
import type { Vehicle } from '@/lib/types';

export default function AIRecommendationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Vehicle | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    // This is a mock implementation.
    // In a real app, you would call your GenAI flow here.
    // e.g., const result = await yourAIFlow.run(prompt);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For demonstration, we'll just pick a random vehicle.
    const randomIndex = Math.floor(Math.random() * vehicles.length);
    setRecommendation(vehicles[randomIndex]);

    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        setPrompt('');
        setRecommendation(null);
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <Sparkles className="mr-2 h-4 w-4" /> Get AI Recommendation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Vehicle Recommendation</DialogTitle>
          <DialogDescription>
            Describe your needs, and our AI will suggest the perfect vehicle for
            you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="prompt">
              What are you looking for in a vehicle?
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'I need a family-friendly SUV with good mileage for city driving and occasional long trips.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
          {isLoading && (
            <div className='flex items-center justify-center p-8'>
                <Sparkles className="h-8 w-8 animate-spin text-primary" />
                <span className='ml-4'>Finding your vehicle...</span>
            </div>
          )}
          {recommendation && !isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>We recommend the {recommendation.brand} {recommendation.model}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>This vehicle is a great match for your needs. You can view more details or add it to your comparison.</p>
                    <div className='mt-4 flex gap-2'>
                        <Button asChild>
                            <Link href={`/vehicles/${recommendation.id}`}>View Details</Link>
                        </Button>
                         <Button variant="outline" onClick={() => handleOpenChange(false)}>Close</Button>
                    </div>
                </CardContent>
            </Card>
          )}
        </div>
        {!recommendation && (
            <DialogFooter>
            <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
                {isLoading ? 'Generating...' : 'Generate Recommendation'}
            </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
