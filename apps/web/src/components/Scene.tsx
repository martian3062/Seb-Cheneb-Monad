"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function MonadHexagonWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Slowly rotate the mesh itself
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }

    // Interactivity: tilt the whole group slightly based on mouse position
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  // Calculate positions for text characters around a circle
  const textRadius = 4;
  const textContent = "Monad Parallel EVM Speed  •  ";
  const numCopies = 2; // Repeat text
  const fullText = textContent.repeat(numCopies);
  const textChars = fullText.split("");

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Radius top 2, bottom 2, height 0.5, 6 radial segments = hexagon! */}
        <cylinderGeometry args={[2, 2, 0.5, 6]} />
        {/* Glow effect via bright color & emissive combined with postprocessing */}
        <meshStandardMaterial color="#8b5cf6" emissive="#4c1d95" emissiveIntensity={2} wireframe={true} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      
      <OrbitingText textChars={textChars} radius={textRadius} />
    </group>
  );
}

function OrbitingText({ textChars, radius }: { textChars: string[]; radius: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.5; // Orbiting rotation
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {textChars.map((char, i) => {
        const angle = (i / textChars.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        {/* Adds stars to the background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
        
        <ambientLight intensity={0.5} />
        <MonadHexagonWireframe />

        {/* Global Bloom Post-Processing for Glowing Neon Crypto aesthetic */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={2.0} mipmapBlur />
        </EffectComposer>

      </Canvas>
    </div>
  );
}
