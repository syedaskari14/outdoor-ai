// 🏊‍♂️ Enhanced Pool System with Organic Shapes & Photorealistic Materials
// This replaces your current Pool component with MUCH better visuals

import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Sphere, Cylinder, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 🎨 PHOTOREALISTIC MATERIAL LIBRARY
const POOL_FINISHES = {
  plaster: {
    name: 'White Plaster',
    shell: '#f8fafc',
    roughness: 0.3,
    metalness: 0.0,
    normalScale: 0.2,
    cost: 8000,
    durability: '15-20 years',
    description: 'Classic smooth finish, easiest maintenance'
  },
  pebbleTec: {
    name: 'Pebble Tec',
    shell: '#4a7c59',
    roughness: 0.8,
    metalness: 0.0,
    normalScale: 0.6,
    cost: 12000,
    durability: '20-25 years',
    description: 'Natural pebble aggregate, slip-resistant'
  },
  glassTile: {
    name: 'Glass Tile',
    shell: '#1e40af',
    roughness: 0.1,
    metalness: 0.4,
    normalScale: 0.1,
    cost: 18000,
    durability: '25+ years',
    description: 'Premium glass mosaic, stunning reflections'
  },
  quartzite: {
    name: 'Quartzite',
    shell: '#6b7280',
    roughness: 0.4,
    metalness: 0.2,
    normalScale: 0.3,
    cost: 15000,
    durability: '20+ years',
    description: 'Natural stone finish, luxury appearance'
  },
  fiberglass: {
    name: 'Fiberglass',
    shell: '#0ea5e9',
    roughness: 0.2,
    metalness: 0.1,
    normalScale: 0.1,
    cost: 6000,
    durability: '15-20 years',
    description: 'Smooth gel coat, quick installation'
  }
};

// 🌊 ADVANCED WATER COLORS
const WATER_COLORS = {
  sunrise: '#87CEEB',
  morning: '#4169E1',
  noon: '#1e40af',
  afternoon: '#2563eb',
  sunset: '#3b82f6',
  evening: '#1e3a8a',
  night: '#0f172a'
};

// 🏊‍♂️ POOL SHAPE GENERATOR
function generatePoolGeometry(shape, size) {
  const [length, width, depth] = size;
  
  switch (shape) {
    case 'rectangle':
      return new THREE.BoxGeometry(length, depth, width);
      
    case 'lagoon':
      // Organic lagoon shape using multiple curves
      const lagoonShape = new THREE.Shape();
      const centerX = length / 2;
      const centerY = width / 2;
      
      // Create organic curved outline
      lagoonShape.moveTo(centerX * 0.3, 0);
      lagoonShape.bezierCurveTo(centerX * 1.2, centerY * 0.2, centerX * 1.1, centerY * 0.8, centerX * 0.9, centerY);
      lagoonShape.bezierCurveTo(centerX * 0.7, centerY * 1.3, centerX * 0.3, centerY * 1.2, centerX * 0.1, centerY * 0.8);
      lagoonShape.bezierCurveTo(-centerX * 0.1, centerY * 0.4, centerX * 0.1, centerY * 0.1, centerX * 0.3, 0);
      
      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.3,
        bevelThickness: 0.2
      };
      
      return new THREE.ExtrudeGeometry(lagoonShape, extrudeSettings);
      
    case 'kidney':
      // Kidney shape using curves
      const kidneyShape = new THREE.Shape();
      const kCenterX = length / 2;
      const kCenterY = width / 2;
      
      kidneyShape.moveTo(kCenterX * 0.2, kCenterY * 0.3);
      kidneyShape.bezierCurveTo(kCenterX * 1.5, kCenterY * 0.1, kCenterX * 1.3, kCenterY * 0.9, kCenterX * 0.8, kCenterY);
      kidneyShape.bezierCurveTo(kCenterX * 0.5, kCenterY * 1.2, kCenterX * 0.2, kCenterY * 1.1, kCenterX * 0.1, kCenterY * 0.7);
      kidneyShape.bezierCurveTo(-kCenterX * 0.1, kCenterY * 0.5, kCenterX * 0.1, kCenterY * 0.2, kCenterX * 0.2, kCenterY * 0.3);
      
      return new THREE.ExtrudeGeometry(kidneyShape, {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 2,
        bevelSize: 0.2,
        bevelThickness: 0.1
      });
      
    case 'infinity':
      // Infinity edge pool (rectangle with vanishing edge effect)
      return new THREE.BoxGeometry(length, depth, width);
      
    case 'lShaped':
      // L-shaped pool using combined geometries
      const shape1 = new THREE.BoxGeometry(length * 0.6, depth, width * 0.6);
      const shape2 = new THREE.BoxGeometry(length * 0.4, depth, width * 0.4);
      // Position offsets would be handled in the pool component
      return shape1; // Simplified for now
      
    case 'lap':
      // Long narrow lap pool
      return new THREE.BoxGeometry(length * 1.5, depth, width * 0.5);
      
    default:
      return new THREE.BoxGeometry(length, depth, width);
  }
}

// 🌊 ENHANCED POOL COMPONENT
function EnhancedPool({ 
  position = [0, 0, 0], 
  size = [24, 6, 12], 
  shape = 'rectangle',
  finish = 'plaster', 
  timeOfDay = 'sunset',
  onSelect,
  hasInfinityEdge = false,
  hasSpillover = false,
  lighting = 'led'
}) {
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const waterRef = useRef();
  const poolRef = useRef();
  const causticsRef = useRef();

  // Get current finish material properties
  const currentFinish = POOL_FINISHES[finish] || POOL_FINISHES.plaster;
  const currentWaterColor = WATER_COLORS[timeOfDay] || WATER_COLORS.sunset;

  // Generate pool geometry based on shape
  const poolGeometry = useMemo(() => generatePoolGeometry(shape, size), [shape, size]);

  // Advanced water animation
  useFrame((state) => {
    if (waterRef.current) {
      // Realistic water movement
      const time = state.clock.elapsedTime;
      waterRef.current.position.y = 0.2 + Math.sin(time * 0.3) * 0.03 + Math.sin(time * 0.7) * 0.01;
      waterRef.current.rotation.z = Math.sin(time * 0.1) * 0.002;
      
      // Update material properties for water shimmer
      if (waterRef.current.material) {
        waterRef.current.material.opacity = 0.85 + Math.sin(time * 1.5) * 0.05;
      }
    }

    // Caustics animation
    if (causticsRef.current) {
      const time = state.clock.elapsedTime;
      causticsRef.current.rotation.z = time * 0.05;
      if (causticsRef.current.material) {
        causticsRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      {/* Pool excavation with realistic dirt */}
      <Box
        args={[size[0] + 3, 2.5, size[2] + 3]}
        position={[0, -1.25, 0]}
      >
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.95} 
          normalScale={[0.3, 0.3]}
        />
      </Box>

      {/* Pool shell with enhanced materials */}
      <mesh
        ref={poolRef}
        geometry={poolGeometry}
        position={[0, -size[1]/2, 0]}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      >
        <meshStandardMaterial 
          color={hovered || isDragging ? '#fbbf24' : currentFinish.shell}
          roughness={currentFinish.roughness}
          metalness={currentFinish.metalness}
          normalScale={[currentFinish.normalScale, currentFinish.normalScale]}
        />
      </mesh>

      {/* Premium coping with natural stone look */}
      <Box 
        args={[size[0] + 1, 0.15, size[2] + 1]} 
        position={[0, 0.075, 0]}
      >
        <meshStandardMaterial 
          color="#d4af9a" 
          roughness={0.7} 
          metalness={0.1}
          normalScale={[0.4, 0.4]}
        />
      </Box>

      {/* PHOTOREALISTIC WATER with advanced effects */}
      <Plane
        ref={waterRef}
        args={[size[0] - 0.8, size[2] - 0.8]}
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={currentWaterColor}
          transparent
          opacity={0.85}
          roughness={0.0}
          metalness={0.05}
          envMapIntensity={2.5}
          normalScale={[0.1, 0.1]}
        />
      </Plane>

      {/* Water caustics effect */}
      <Plane
        ref={causticsRef}
        args={[size[0] - 0.5, size[2] - 0.5]}
        position={[0, -0.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color="#87ceeb"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Plane>

      {/* Infinity edge effect */}
      {hasInfinityEdge && (
        <Box 
          args={[size[0], 0.05, 0.3]} 
          position={[0, 0.15, -size[2]/2 - 0.15]}
        >
          <meshStandardMaterial 
            color={currentFinish.shell}
            transparent
            opacity={0.8}
          />
        </Box>
      )}

      {/* Pool steps with finish matching */}
      <Box 
        args={[2.5, 1, 1]} 
        position={[size[0]/2 - 1.25, -0.5, size[2]/2 - 0.5]}
      >
        <meshStandardMaterial 
          color={currentFinish.shell} 
          roughness={currentFinish.roughness + 0.2}
          metalness={currentFinish.metalness}
        />
      </Box>

      {/* Pool equipment with realistic materials */}
      <Cylinder 
        args={[0.4, 0.4, 0.8]} 
        position={[size[0]/2 + 1.5, 0.4, size[2]/2 + 1]}
      >
        <meshStandardMaterial 
          color="#4a5568" 
          roughness={0.2}
          metalness={0.8}
        />
      </Cylinder>

      {/* Enhanced LED lighting system */}
      {lighting === 'led' && (
        <>
          {/* Underwater LED spots */}
          <Sphere args={[0.08]} position={[size[0]/4, 0.1, size[2]/4]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#4a90e2" 
              emissiveIntensity={1.2}
            />
          </Sphere>
          <Sphere args={[0.08]} position={[-size[0]/4, 0.1, -size[2]/4]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#4a90e2" 
              emissiveIntensity={1.2}
            />
          </Sphere>
          <Sphere args={[0.08]} position={[size[0]/4, 0.1, -size[2]/4]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#4a90e2" 
              emissiveIntensity={1.2}
            />
          </Sphere>
          <Sphere args={[0.08]} position={[-size[0]/4, 0.1, size[2]/4]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#4a90e2" 
              emissiveIntensity={1.2}
            />
          </Sphere>

          {/* Pool lighting effects */}
          <pointLight 
            position={[size[0]/4, 0.3, size[2]/4]} 
            color="#4a90e2" 
            intensity={0.8} 
            distance={8}
            decay={2}
          />
          <pointLight 
            position={[-size[0]/4, 0.3, -size[2]/4]} 
            color="#4a90e2" 
            intensity={0.8} 
            distance={8}
            decay={2}
          />
          <pointLight 
            position={[size[0]/4, 0.3, -size[2]/4]} 
            color="#4a90e2" 
            intensity={0.8} 
            distance={8}
            decay={2}
          />
          <pointLight 
            position={[-size[0]/4, 0.3, size[2]/4]} 
            color="#4a90e2" 
            intensity={0.8} 
            distance={8}
            decay={2}
          />
        </>
      )}

      {/* Spillover spa feature */}
      {hasSpillover && (
        <Cylinder 
          args={[3, 3, 1.2]} 
          position={[size[0]/2 + 2, 0.6, 0]}
        >
          <meshStandardMaterial 
            color={currentFinish.shell}
            roughness={currentFinish.roughness}
            metalness={currentFinish.metalness}
          />
        </Cylinder>
      )}

      {/* Enhanced visual feedback */}
      {isDragging && (
        <>
          <Box args={[0.3, 12, 0.3]} position={[0, 6, 0]}>
            <meshStandardMaterial 
              color="#10b981" 
              transparent 
              opacity={0.8}
              emissive="#10b981"
              emissiveIntensity={0.6}
            />
          </Box>
          <Sphere args={[1.5]} position={[0, 1, 0]}>
            <meshStandardMaterial 
              color="#10b981" 
              transparent 
              opacity={0.2}
              emissive="#10b981"
              emissiveIntensity={0.3}
            />
          </Sphere>
        </>
      )}

      {/* Hover glow effect */}
      {hovered && !isDragging && (
        <Sphere args={[Math.max(...size) * 0.6]} position={[0, 1, 0]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.1}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </Sphere>
      )}
    </group>
  );
}

// 🎮 POOL SHAPE SELECTOR COMPONENT
function PoolShapeSelector({ currentShape, onShapeChange, designData }) {
  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', description: 'Classic geometric pool', cost: 0 },
    { id: 'lagoon', name: 'Lagoon', icon: '🌊', description: 'Organic curved pool', cost: 5000 },
    { id: 'kidney', name: 'Kidney', icon: '🫘', description: 'Traditional curved shape', cost: 3000 },
    { id: 'infinity', name: 'Infinity', icon: '♾️', description: 'Vanishing edge pool', cost: 15000 },
    { id: 'lShaped', name: 'L-Shaped', icon: '📐', description: 'Corner design pool', cost: 4000 },
    { id: 'lap', name: 'Lap Pool', icon: '🏊‍♂️', description: 'Long swimming pool', cost: 2000 }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '12px', 
        color: '#cbd5e1' 
      }}>
        Pool Shape
      </label>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px' 
      }}>
        {shapes.map(shape => (
          <button
            key={shape.id}
            onClick={() => onShapeChange(shape.id)}
            style={{
              background: currentShape === shape.id 
                ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                : 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 8px',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '16px', marginBottom: '4px' }}>{shape.icon}</span>
            <span style={{ fontSize: '11px', marginBottom: '2px' }}>{shape.name}</span>
            <span style={{ fontSize: '8px', opacity: 0.8 }}>
              {shape.cost > 0 ? `+$${shape.cost.toLocaleString()}` : 'Base price'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 🎨 FINISH SELECTOR COMPONENT
function PoolFinishSelector({ currentFinish, onFinishChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '12px', 
        color: '#cbd5e1' 
      }}>
        Pool Finish
      </label>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '8px' 
      }}>
        {Object.entries(POOL_FINISHES).map(([key, finish]) => (
          <button
            key={key}
            onClick={() => onFinishChange(key)}
            style={{
              background: currentFinish === key 
                ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                : 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', marginBottom: '2px' }}>{finish.name}</div>
                <div style={{ fontSize: '9px', opacity: 0.8 }}>{finish.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: '700' }}>${finish.cost.toLocaleString()}</div>
                <div style={{ fontSize: '8px', opacity: 0.7 }}>{finish.durability}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Export enhanced components
export { 
  EnhancedPool, 
  PoolShapeSelector, 
  PoolFinishSelector, 
  POOL_FINISHES, 
  WATER_COLORS 
};