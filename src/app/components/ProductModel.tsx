'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Text, Box, Sphere, Cylinder } from '@react-three/drei';

export default function ProductModel() {
  const groupRef = useRef<Group>(null);
  const boxRef = useRef<Mesh>(null);
  const sphereRef = useRef<Mesh>(null);
  const cylinderRef = useRef<Mesh>(null);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the main group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
    }
    
    // Animate individual components
    if (boxRef.current) {
      boxRef.current.position.y = Math.sin(time * 2) * 0.2;
      boxRef.current.rotation.x = time * 0.5;
    }
    
    if (sphereRef.current) {
      sphereRef.current.position.x = Math.cos(time * 1.5) * 1.5;
      sphereRef.current.position.z = Math.sin(time * 1.5) * 1.5;
    }
    
    if (cylinderRef.current) {
      cylinderRef.current.rotation.z = time * 0.8;
      cylinderRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Product - Security Camera */}
      <group position={[0, 0, 0]}>
        {/* Camera Body */}
        <Box
          ref={boxRef}
          args={[1.5, 0.8, 1]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </Box>
        
        {/* Camera Lens */}
        <Cylinder
          ref={cylinderRef}
          args={[0.3, 0.4, 0.6, 16]}
          position={[0, 0, 0.7]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* LED Indicator */}
        <Sphere
          args={[0.05, 16, 16]}
          position={[0.5, 0.3, 0.5]}
        >
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        {/* Mount */}
        <Cylinder
          args={[0.1, 0.1, 0.5, 8]}
          position={[0, -0.65, 0]}
        >
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </Cylinder>
      </group>
      
      {/* Floating Security Elements */}
      <Sphere
        ref={sphereRef}
        args={[0.2, 16, 16]}
        position={[1.5, 1, 1.5]}
      >
        <meshStandardMaterial 
          color="#0066ff" 
          emissive="#0066ff" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      {/* Data Points */}
      {Array.from({ length: 8 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 2.5,
            Math.sin((i / 8) * Math.PI * 2) * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * 2.5
          ]}
        >
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600" 
            emissiveIntensity={0.4}
          />
        </Sphere>
      ))}
      
      {/* Product Label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SecureSight Pro Camera
      </Text>
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
    </group>
  );
}
