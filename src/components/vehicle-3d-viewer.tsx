'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import PlaceholderCar from './placeholder-car';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import ViewerControls from './viewer-controls';
import type { Part } from '@/app/3d-view/page';

interface Vehicle3DViewerProps {
    onPartSelect: (part: Part | null) => void;
    hiddenParts: string[];
}

export default function Vehicle3DViewer({ onPartSelect, hiddenParts }: Vehicle3DViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const resetCamera = () => {
    controlsRef.current?.reset();
  };

  return (
    <div className="relative w-full h-full">
       <ViewerControls onReset={resetCamera} />
       <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera preset="rembrandt">
            <PlaceholderCar onPartSelect={onPartSelect} hiddenParts={hiddenParts} />
          </Stage>
        </Suspense>
        <OrbitControls ref={controlsRef} makeDefault />
      </Canvas>
    </div>
  );
}
