// 🔧 SIMPLIFIED POOL FIX - This will definitely work!
import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// 🎨 POOL FINISHES (same as before)
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

// 🌊 WATER COLORS
const WATER_COLORS = {
  sunrise: '#87CEEB',
  morning: '#4169E1',
  noon: '#1e40af',
  afternoon: '#2563eb',
  sunset: '#3b82f6',
  evening: '#1e3a8a',
  night: '#0f172a'
};

// 🏊‍♂️ SIMPLE BUT EFFECTIVE POOL SHAPES
function PoolShape({ shape, size, finish, hovered, isDragging, onSelect }) {
  const [length, width, depth] = size;
  const currentFinish = POOL_FINISHES[finish] || POOL_FINISHES.plaster;
  
  const materialProps = {
    color: hovered || isDragging ? '#fbbf24' : currentFinish.shell,
    roughness: currentFinish.roughness,
    metalness: currentFinish.metalness,
    normalScale: [currentFinish.normalScale, currentFinish.normalScale]
  };

  // 🔧 SIMPLE APPROACH: Different components for different shapes
  switch (shape) {
    case 'rectangle':
      return (
        <Box 
          args={[length, depth, width]} 
          position={[0, -depth/2, 0]}
          onClick={onSelect}
        >
          <meshStandardMaterial {...materialProps} />
        </Box>
      );
      
    case 'lagoon':
      // Create lagoon using stretched ellipse
      return (
        <group onClick={onSelect}>
          {/* Main oval body */}
          <Cylinder 
            args={[length * 0.6, length * 0.5, depth, 32]} 
            position={[0, -depth/2, 0]}
            rotation={[0, 0, 0]}
          >
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
          {/* Curved extension */}
          <Cylinder 
            args={[width * 0.4, width * 0.3, depth, 32]} 
            position={[length * 0.3, -depth/2, width * 0.2]}
            rotation={[0, Math.PI/6, 0]}
          >
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
        </group>
      );
      
    case 'kidney':
      // Create kidney using two overlapping cylinders
      return (
        <group onClick={onSelect}>
          {/* Main body */}
          <Cylinder 
            args={[length * 0.4, length * 0.4, depth, 32]} 
            position={[0, -depth/2, 0]}
          >
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
          {/* Kidney curve */}
          <Cylinder 
            args={[width * 0.35, width * 0.3, depth, 32]} 
            position={[length * 0.2, -depth/2, -width * 0.15]}
          >
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
        </group>
      );
      
    case 'infinity':
      // Rectangle with special edge effect
      return (
        <group onClick={onSelect}>
          <Box 
            args={[length, depth, width]} 
            position={[0, -depth/2, 0]}
          >
            <meshStandardMaterial {...materialProps} />
          </Box>
          {/* Infinity edge */}
          <Box 
            args={[length, depth * 0.1, width * 0.1]} 
            position={[0, 0, -width/2]}
          >
            <meshStandardMaterial 
              color={currentFinish.shell}
              transparent
              opacity={0.6}
            />
          </Box>
        </group>
      );
      
    case 'lShaped':
      // Create L-shape using two boxes
      return (
        <group onClick={onSelect}>
          {/* Main section */}
          <Box 
            args={[length * 0.6, depth, width]} 
            position={[length * 0.2, -depth/2, 0]}
          >
            <meshStandardMaterial {...materialProps} />
          </Box>
          {/* L extension */}
          <Box 
            args={[length * 0.4, depth, width * 0.5]} 
            position={[-length * 0.1, -depth/2, width * 0.25]}
          >
            <meshStandardMaterial {...materialProps} />
          </Box>
        </group>
      );
      
    case 'lap':
      // Long narrow lap pool
      return (
        <Box 
          args={[length * 1.8, depth, width * 0.6]} 
          position={[0, -depth/2, 0]}
          onClick={onSelect}
        >
          <meshStandardMaterial {...materialProps} />
        </Box>
      );
      
    default:
      return (
        <Box 
          args={[length, depth, width]} 
          position={[0, -depth/2, 0]}
          onClick={onSelect}
        >
          <meshStandardMaterial {...materialProps} />
        </Box>
      );
  }
}

// 🌊 WATER COMPONENT
function PoolWater({ shape, size, timeOfDay }) {
  const waterRef = useRef();
  const [length, width] = size;
  const currentWaterColor = WATER_COLORS[timeOfDay] || WATER_COLORS.sunset;
  
  // Get water dimensions based on shape
  const getWaterSize = () => {
    switch (shape) {
      case 'lagoon':
        return [length * 0.9, width * 0.9];
      case 'kidney':
        return [length * 0.8, width * 0.8];
      case 'lShaped':
        return [length * 0.9, width * 0.8];
      case 'lap':
        return [length * 1.6, width * 0.5];
      default:
        return [length - 1, width - 1];
    }
  };
  
  const [waterLength, waterWidth] = getWaterSize();
  
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.elapsedTime;
      waterRef.current.position.y = 0.2 + Math.sin(time * 0.3) * 0.03;
      if (waterRef.current.material) {
        waterRef.current.material.opacity = 0.85 + Math.sin(time * 1.5) * 0.05;
      }
    }
  });
  
  return (
    <Plane
      ref={waterRef}
      args={[waterLength, waterWidth]}
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
      />
    </Plane>
  );
}

// 🌊 MAIN ENHANCED POOL COMPONENT
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

  console.log('🏊‍♂️ EnhancedPool rendering:', { shape, size, finish });

  return (
    <group position={position}>
      {/* Pool excavation */}
      <Box
        args={[size[0] + 3, 2.5, size[2] + 3]}
        position={[0, -1.25, 0]}
      >
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.95} 
        />
      </Box>

      {/* 🔧 MAIN POOL SHAPE - This will actually change! */}
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      >
        <PoolShape 
          shape={shape}
          size={size}
          finish={finish}
          hovered={hovered}
          isDragging={isDragging}
          onSelect={onSelect}
        />
      </group>

      {/* Pool coping */}
      <Box 
        args={[size[0] + 1, 0.15, size[2] + 1]} 
        position={[0, 0.075, 0]}
      >
        <meshStandardMaterial 
          color="#d4af9a" 
          roughness={0.7} 
          metalness={0.1}
        />
      </Box>

      {/* 🌊 WATER - Changes with shape */}
      <PoolWater 
        shape={shape}
        size={size}
        timeOfDay={timeOfDay}
      />

      {/* Pool equipment */}
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

      {/* LED lighting */}
      {lighting === 'led' && (
        <>
          <Sphere args={[0.08]} position={[size[0]/4, 0.1, size[2]/4]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#4a90e2" 
              emissiveIntensity={1.2}
            />
          </Sphere>
          <pointLight 
            position={[size[0]/4, 0.3, size[2]/4]} 
            color="#4a90e2" 
            intensity={0.8} 
            distance={8}
            decay={2}
          />
        </>
      )}

      {/* Spillover spa */}
      {hasSpillover && (
        <Cylinder 
          args={[3, 3, 1.2]} 
          position={[size[0]/2 + 2, 0.6, 0]}
        >
          <meshStandardMaterial 
            color={POOL_FINISHES[finish].shell}
            roughness={POOL_FINISHES[finish].roughness}
            metalness={POOL_FINISHES[finish].metalness}
          />
        </Cylinder>
      )}

      {/* Visual feedback */}
      {isDragging && (
        <Sphere args={[1.5]} position={[0, 1, 0]}>
          <meshStandardMaterial 
            color="#10b981" 
            transparent 
            opacity={0.2}
            emissive="#10b981"
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}

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

// 🎮 SHAPE SELECTOR with debug logging
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
            onClick={() => {
              console.log('🎯 SHAPE CHANGE:', shape.id);
              onShapeChange(shape.id);
            }}
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

// 🎨 FINISH SELECTOR
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
            onClick={() => {
              console.log('🎨 FINISH CHANGE:', key);
              onFinishChange(key);
            }}
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

export { 
  EnhancedPool, 
  PoolShapeSelector, 
  PoolFinishSelector, 
  POOL_FINISHES, 
  WATER_COLORS 
};