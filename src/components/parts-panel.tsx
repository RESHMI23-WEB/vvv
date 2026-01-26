'use client';
import type { Part } from '@/app/3d-view/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Car, Scan } from 'lucide-react';

interface PartsPanelProps {
  selectedPart: Part | null;
  hiddenParts: string[];
  onToggleVisibility: (partName: string) => void;
}

const allParts: Part[] = [
    { name: 'Body', description: 'The main chassis and frame of the vehicle.' },
    { name: 'FrontLeftWheel', description: 'Front left wheel assembly.' },
    { name: 'FrontRightWheel', description: 'Front right wheel assembly.' },
    { name: 'RearLeftWheel', description: 'Rear left wheel assembly.' },
    { name: 'RearRightWheel', description: 'Rear right wheel assembly.' },
    { name: 'Cabin', description: 'The interior passenger compartment.' },
    { name: 'Engine', description: 'The powertrain of the vehicle.', specs: { Type: 'Placeholder V8', Displacement: '5000cc' } },
];


export default function PartsPanel({ selectedPart, hiddenParts, onToggleVisibility }: PartsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Scan className="w-6 h-6"/>
            Part Inspector
        </CardTitle>
        <CardDescription>
          {selectedPart ? 'Details about the selected part.' : 'Select a part on the model to see its details.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedPart ? (
          <div>
            <h3 className="font-bold text-lg">{selectedPart.name}</h3>
            <p className="text-muted-foreground mt-1">{selectedPart.description}</p>
            {selectedPart.specs && (
              <div className="mt-4 space-y-2">
                {Object.entries(selectedPart.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Car className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-2">No part selected</p>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold">Part Visibility</h4>
          <div className="space-y-3">
            {allParts.map(part => (
               <div key={part.name} className="flex items-center justify-between">
                <Label htmlFor={`switch-${part.name}`}>{part.name}</Label>
                <Switch 
                  id={`switch-${part.name}`}
                  checked={!hiddenParts.includes(part.name)}
                  onCheckedChange={() => onToggleVisibility(part.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
