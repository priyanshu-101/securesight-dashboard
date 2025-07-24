'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Color } from 'three';
import { Text, Box, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Scene3D() {
  const groupRef = useRef<Group>(null);
  const networkNodesRef = useRef<Mesh[]>([]);
  const cameraNodesRef = useRef<Group[]>([]);

  // Generate network connections
  const networkConnections = useMemo(() => {
    const connections = [];
    const nodePositions = [
      [-3, 2, -2], [0, 3, 0], [3, 2, -2],
      [-2, 0, 2], [0, 0, 0], [2, 0, 2],
      [-1, -2, -1], [1, -2, -1]
    ];

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (Math.random() > 0.6) { // 40% chance of connection
          connections.push({
            start: nodePositions[i],
            end: nodePositions[j],
            color: new Color().setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.6)
          });
        }
      }
    }
    return connections;
  }, []);

  // Camera network positions
  const cameraPositions = useMemo(() => [
    [-4, 1, -3], [4, 1, -3], [0, 4, 0],
    [-2, -1, 3], [2, -1, 3]
  ], []);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the main group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
    
    // Animate network nodes
    networkNodesRef.current.forEach((node, index) => {
      if (node && node.material) {
        node.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.3);
        const hue = (time * 0.1 + index * 0.1) % 1;
        const material = node.material as THREE.MeshStandardMaterial;
        material.color.setHSL(hue, 0.8, 0.6);
        material.emissive.setHSL(hue, 0.8, 0.3);
      }
    });
    
    // Animate camera nodes
    cameraNodesRef.current.forEach((camera, index) => {
      if (camera) {
        camera.rotation.y = time * 0.5 + index;
        camera.position.y += Math.sin(time * 1.5 + index) * 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Central Hub */}
      <Box
        args={[0.8, 0.8, 0.8]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#00aaff" 
          emissive="#0066aa" 
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Network Nodes */}
      {[
        [-3, 2, -2], [0, 3, 0], [3, 2, -2],
        [-2, 0, 2], [2, 0, 2],
        [-1, -2, -1], [1, -2, -1]
      ].map((position, index) => (
        <Sphere
          key={index}
          ref={(el) => {
            if (el) networkNodesRef.current[index] = el;
          }}
          args={[0.3, 16, 16]}
          position={position as [number, number, number]}
        >
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff3300" 
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* Network Connections */}
      {networkConnections.map((connection, index) => {
        const points = [
          new THREE.Vector3(...connection.start),
          new THREE.Vector3(...connection.end)
        ];
        
        return (
          <Line
            key={index}
            points={points}
            color={connection.color}
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        );
      })}
      
      {/* Security Cameras */}
      {cameraPositions.map((position, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) cameraNodesRef.current[index] = el;
          }}
          position={position as [number, number, number]}
        >
          {/* Camera Body */}
          <Box args={[0.4, 0.2, 0.3]}>
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          </Box>
          
          {/* Camera Lens */}
          <Sphere args={[0.08, 16, 16]} position={[0, 0, 0.2]}>
            <meshStandardMaterial 
              color="#000000" 
              metalness={0.9} 
              roughness={0.1}
            />
          </Sphere>
          
          {/* Status Light */}
          <Sphere args={[0.03, 8, 8]} position={[0.15, 0.08, 0.1]}>
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={0.8}
            />
          </Sphere>
          
          {/* Detection Range Visualization */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, 0.5]}>
            <coneGeometry args={[0.5, 1, 8, 1, true]} />
            <meshStandardMaterial 
              color="#ffff00" 
              transparent 
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      
      {/* Floating Data Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.02, 8, 8]}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 10
          ]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* Labels */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Security Network Visualization
      </Text>
      
      <Text
        position={[0, -4.2, 0]}
        fontSize={0.2}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        Real-time camera network monitoring
      </Text>
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0066ff" />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.8} 
        angle={0.3} 
        penumbra={0.5}
        color="#00ffff"
      />
    </group>
  );
}
