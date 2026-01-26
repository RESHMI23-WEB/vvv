'use client';

import { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import type { Part } from '@/app/3d-view/page';

interface PlaceholderCarProps {
    onPartSelect: (part: Part | null) => void;
    hiddenParts: string[];
}

const partsData: Record<string, Part> = {
    Body: { name: 'Body', description: 'The main chassis and frame of the vehicle.' },
    FrontLeftWheel: { name: 'FrontLeftWheel', description: 'Front left wheel assembly.' },
    FrontRightWheel: { name: 'FrontRightWheel', description: 'Front right wheel assembly.' },
    RearLeftWheel: { name: 'RearLeftWheel', description: 'Rear left wheel assembly.' },
    RearRightWheel: { name: 'RearRightWheel', description: 'Rear right wheel assembly.' },
    Cabin: { name: 'Cabin', description: 'The interior passenger compartment.' },
    Engine: { name: 'Engine', description: 'The powertrain of the vehicle.', specs: { Type: 'Placeholder V8', Displacement: '5000cc' } },
};

function CarPart({ name, onSelect, isHidden, ...props }: any) {
    const ref = useRef<any>();
    const [hovered, setHover] = useState(false);
    const [selected, setSelected] = useState(false);

    useCursor(hovered);
    
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setSelected(!selected);
        onSelect(partsData[name]);
    };
    
    return (
        <mesh
            {...props}
            ref={ref}
            visible={!isHidden}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
            onPointerOut={() => setHover(false)}
            onClick={handleClick}
            castShadow
        >
            {props.children}
            <meshStandardMaterial
                color={hovered ? 'hotpink' : 'hsl(var(--primary))'}
                transparent
                opacity={hovered ? 0.9 : 1}
             />
        </mesh>
    );
}

function Wheel(props: any) {
    return (
        <CarPart {...props}>
             <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
        </CarPart>
    );
}

export default function PlaceholderCar({ onPartSelect, hiddenParts }: PlaceholderCarProps) {
    const handleSelect = (part: Part) => {
        onPartSelect(part);
    };
    
    return (
        <group onPointerMiss={() => onPartSelect(null)}>
            {/* Body */}
            <CarPart 
                name="Body" 
                onSelect={handleSelect} 
                position={[0, 0.5, 0]} 
                isHidden={hiddenParts.includes('Body')}
            >
                <boxGeometry args={[3, 0.8, 1.5]} />
            </CarPart>
            
            {/* Cabin */}
             <CarPart 
                name="Cabin" 
                onSelect={handleSelect} 
                position={[0, 1.3, 0]} 
                isHidden={hiddenParts.includes('Cabin')}
            >
                <boxGeometry args={[1.5, 0.8, 1.3]} />
            </CarPart>
            
            {/* Engine block */}
             <CarPart 
                name="Engine" 
                onSelect={handleSelect} 
                position={[0.8, 0.5, 0]} 
                isHidden={hiddenParts.includes('Engine')}
            >
                <boxGeometry args={[0.8, 0.6, 0.8]} />
            </CarPart>

            {/* Wheels */}
            <Wheel name="FrontRightWheel" onSelect={handleSelect} isHidden={hiddenParts.includes('FrontRightWheel')} position={[1, 0.35, 0.75]} rotation={[Math.PI / 2, 0, 0]} />
            <Wheel name="FrontLeftWheel" onSelect={handleSelect} isHidden={hiddenParts.includes('FrontLeftWheel')} position={[1, 0.35, -0.75]} rotation={[Math.PI / 2, 0, 0]} />
            <Wheel name="RearRightWheel" onSelect={handleSelect} isHidden={hiddenParts.includes('RearRightWheel')} position={[-1, 0.35, 0.75]} rotation={[Math.PI / 2, 0, 0]} />
            <Wheel name="RearLeftWheel" onSelect={handleSelect} isHidden={hiddenParts.includes('RearLeftWheel')} position={[-1, 0.35, -0.75]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    );
}
