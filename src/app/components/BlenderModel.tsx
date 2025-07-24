'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { Group } from 'three';
import * as THREE from 'three';

interface BlenderModelProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  autoRotate?: boolean;
  animationName?: string;
}

export default function BlenderModel({ 
  modelPath = "/models/smartsight-model.glb", 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = true,
  animationName
}: BlenderModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load the GLTF model with error handling
  let scene, animations;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
    animations = gltf.animations;
  } catch (err) {
    console.error('Error loading model:', err);
    setError('Failed to load 3D model');
  }
  
  // Set up animations if available
  const { actions, names } = useAnimations(animations || [], groupRef);
  
  // Play animation if specified
  useEffect(() => {
    if (animationName && actions[animationName]) {
      actions[animationName]?.play();
    } else if (names.length > 0 && actions[names[0]]) {
      // Play first available animation
      actions[names[0]]?.play();
    }
  }, [actions, animationName, names]);
  
  // Animation loop for auto-rotation and hover effects
  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005; // Slower rotation
    }
    
    // Scale effect on hover
    if (groupRef.current) {
      const targetScale = hovered ? 1.05 : 1; // Subtle scale effect
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      
      if (Array.isArray(scale)) {
        groupRef.current.scale.set(
          newScale * scale[0], 
          newScale * scale[1], 
          newScale * scale[2]
        );
      } else {
        groupRef.current.scale.setScalar(newScale * scale);
      }
    }
  });
  
  if (error) {
    return (
      <group position={position}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          Model Loading Error
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          Check console for details
        </Text>
      </group>
    );
  }
  
  if (!scene) {
    return (
      <group position={position}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#4444ff"
          anchorX="center"
          anchorY="middle"
        >
          Loading Model...
        </Text>
      </group>
    );
  }
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive 
        object={scene.clone()} 
        dispose={null}
      />
      
      {/* Enhanced lighting for the model */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[2, 2, 2]} 
        intensity={0.5} 
        color="#ffffff" 
      />
      <pointLight 
        position={[-2, -1, -2]} 
        intensity={0.3} 
        color="#4f46e5" 
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        castShadow
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/models/smartsight-model.glb");
