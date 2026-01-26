'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PartsPanel from '@/components/parts-panel';
import { Card, CardContent } from '@/components/ui/card';

// Dynamically import the 3D viewer to avoid SSR issues with three.js
const Vehicle3DViewer = dynamic(() => import('@/components/vehicle-3d-viewer'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center">Loading 3D Model...</div>,
});

export type Part = {
  name: string;
  description: string;
  specs?: Record<string, string>;
};

export default function ThreeDViewPage() {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [hiddenParts, setHiddenParts] = useState<string[]>([]);
  
  const togglePartVisibility = (partName: string) => {
    setHiddenParts(prev => 
      prev.includes(partName) ? prev.filter(p => p !== partName) : [...prev, partName]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          3D Vehicle Explorer
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Interact with the vehicle model. Click on parts to learn more about them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 h-[60vh] lg:h-[70vh]">
          <CardContent className="p-0 h-full">
            <Vehicle3DViewer 
              onPartSelect={setSelectedPart} 
              hiddenParts={hiddenParts} 
            />
          </CardContent>
        </Card>

        <PartsPanel 
          selectedPart={selectedPart}
          hiddenParts={hiddenParts}
          onToggleVisibility={togglePartVisibility}
        />
      </div>
    </div>
  );
}
