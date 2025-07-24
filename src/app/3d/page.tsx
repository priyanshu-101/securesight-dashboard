'use client';

import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import ProductModel from '../components/ProductModel';
import Scene3D from '../components/Scene3D';
import BlenderModel from '../components/BlenderModelNew';

export default function ThreeDPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="bg-gray-900 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">SecureSight 3D</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* 3D Scene 1 - Product Model */}
      <section className="h-screen relative">
        <div className="absolute top-8 left-8 z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Product Showcase</h2>
          <p className="text-gray-400 max-w-md">
            Interactive 3D product model with smooth animations and realistic lighting.
            Hover and drag to explore the model from different angles.
          </p>
        </div>
        
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Suspense fallback={null}>
            <ProductModel />
            <Environment preset="studio" />
            <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </section>

      {/* 3D Scene 2 - SmartSight Model */}
      <section className="h-screen relative bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute top-8 left-8 z-10">
          <h2 className="text-3xl font-bold text-white mb-2">SmartSight Product Model</h2>
          <p className="text-gray-400 max-w-md">
            Your custom SmartSight 3D model with interactive controls and smooth animations.
            Drag to rotate, scroll to zoom, and watch it automatically rotate.
          </p>
        </div>
        
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <Suspense fallback={null}>
            <BlenderModel 
              modelPath="/models/smartsight-model.glb"
              position={[0, -1, 0]}
              scale={2}
              autoRotate={true}
            />
            <Environment preset="warehouse" />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </section>

      {/* 3D Scene 3 - Abstract Scene */}
      <section className="h-screen relative bg-gradient-to-b from-black to-gray-900">
        <div className="absolute top-8 right-8 z-10 text-right">
          <h2 className="text-3xl font-bold text-white mb-2">Security Visualization</h2>
          <p className="text-gray-400 max-w-md">
            Abstract 3D representation of security data with dynamic animations
            and interactive elements representing camera networks.
          </p>
        </div>
        
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <Suspense fallback={null}>
            <Scene3D />
            <Environment preset="night" />
            <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 p-8 border-t border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">SecureSight Technologies</h3>
          <p className="text-gray-400 text-sm">
            Advanced security monitoring with cutting-edge 3D visualization
          </p>
        </div>
      </footer>
    </div>
  );
}
