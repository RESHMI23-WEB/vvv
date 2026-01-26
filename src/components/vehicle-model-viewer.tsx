'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Stage } from '@react-three/drei';

function PlaceholderModel() {
  return (
    // Dimensions are roughly car-like: length, height, width
    <Box args={[3, 1.2, 1.5]} castShadow>
        <meshStandardMaterial color="hsl(var(--primary))" />
    </Box>
  );
}

export default function VehicleModelViewer() {
  return (
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} adjustCamera preset="rembrandt" shadows="contact">
            <PlaceholderModel />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate enableZoom={true} enablePan={false} />
      </Canvas>
  );
}
