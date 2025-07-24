'use client';

import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text, Box } from '@react-three/drei';
import { Group } from 'three';
import * as THREE from 'three';

interface BlenderModelProps {
  modelPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  autoRotate?: boolean;
}

// Simple fallback component
function ModelFallback({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[2, 2, 2]}>
        <meshStandardMaterial color="#666666" wireframe />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading Model...
      </Text>
    </group>
  );
}

// Model component with proper error handling
function Model({ modelPath, position, rotation, scale, autoRotate }: BlenderModelProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load the GLTF model
  const gltf = useGLTF(modelPath || "/models/smartsight-model.glb");
  
  // Animation loop
  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.01;
    }
    
    // Scale effect on hover
    if (groupRef.current) {
      const targetScale = hovered ? 1.1 : 1;
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      
      if (Array.isArray(scale)) {
        groupRef.current.scale.set(
          newScale * scale[0], 
          newScale * scale[1], 
          newScale * scale[2]
        );
      } else {
        groupRef.current.scale.setScalar(newScale * (scale || 1));
      }
    }
  });
  
  if (!gltf || !gltf.scene) {
    return <ModelFallback position={position || [0, 0, 0]} />;
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
        object={gltf.scene.clone()} 
        dispose={null}
      />
      
      {/* Additional lighting */}
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
      
      {/* Hover indicator */}
      {hovered && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          SmartSight Model
        </Text>
      )}
    </group>
  );
}

export default function BlenderModel(props: BlenderModelProps) {
  return (
    <Suspense fallback={<ModelFallback position={props.position || [0, 0, 0]} />}>
      <Model {...props} />
    </Suspense>
  );
}

// Preload the model
useGLTF.preload("/models/smartsight-model.glb");
