'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Box, Plane } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

// Pool component with realistic materials
interface PoolProps {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
  onSelect?: () => void;
}

function Pool({ position = [0, 0, 0], size = [16, 8, 6], color = '#0066cc', onSelect }: PoolProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      {/* Pool shell */}
      <Box
        args={[size[0], 2, size[1]]}
        position={[0, -1, 0]}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#0088ff' : color}
          roughness={0.1}
          metalness={0.0}
        />
      </Box>
      
      {/* Water surface */}
      <Plane
        args={[size[0], size[1]]}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color="#0088ff"
          transparent
          opacity={0.8}
          roughness={0.05}
          metalness={0.0}
        />
      </Plane>
      
      {/* Pool coping */}
      <Box args={[size[0] + 1, 0.2, size[1] + 1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#d4af37" roughness={0.7} />
      </Box>
    </group>
  );
}

// Deck component
interface DeckProps {
  position?: [number, number, number];
  size?: [number, number];
  material?: string;
}

function Deck({ position = [0, 0, 0], size = [20, 12], material = 'wood' }: DeckProps) {
  const materials: Record<string, string> = {
    wood: '#8B4513',
    composite: '#A0522D',
    concrete: '#C0C0C0'
  };
  
  return (
    <Plane
      args={size}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial 
        color={materials[material]}
        roughness={0.8}
      />
    </Plane>
  );
}

// Ground plane
function Ground() {
  return (
    <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <meshStandardMaterial color="#228B22" roughness={0.9} />
    </Plane>
  );
}

// 3D Scene component
interface SceneProps {
  designData: DesignData;
  onPoolSelect: () => void;
}

function Scene({ designData, onPoolSelect }: SceneProps) {
  return (
    <>
      <OrbitControls enablePan enableZoom enableRotate />
      <Environment preset="park" />
      <ContactShadows 
        opacity={0.4} 
        scale={50} 
        blur={1} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ground */}
      <Ground />
      
      {/* Pool */}
      {designData.pool && (
        <Pool 
          position={designData.pool.position}
          size={designData.pool.size}
          color={designData.pool.color}
          onSelect={onPoolSelect}
        />
      )}
      
      {/* Deck */}
      {designData.deck && (
        <Deck 
          position={designData.deck.position}
          size={designData.deck.size}
          material={designData.deck.material}
        />
      )}
      
      {/* Sample house (placeholder) */}
      <Box args={[20, 10, 15]} position={[-25, 5, -20]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      
      {/* Sample fence */}
      <Box args={[60, 6, 0.5]} position={[0, 3, -30]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.5, 6, 60]} position={[-30, 3, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.5, 6, 60]} position={[30, 3, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </>
  );
}

// Photo upload component
interface PhotoUploadProps {
  onUpload: (files: File[]) => void;
  photos: File[];
}

function PhotoUpload({ onUpload, photos }: PhotoUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: onUpload
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-blue-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          <h3 className="text-2xl font-semibold text-gray-800">Upload Backyard Photos</h3>
          <p className="text-gray-600">Drop 5-10 photos or click to browse</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>✓ Take photos from different angles</p>
            <p>✓ Include all corners of your yard</p>
            <p>✓ Good lighting preferred</p>
            <p>✓ Show existing features (doors, windows, fences)</p>
          </div>
        </div>
      </div>
      
      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Uploaded Photos ({photos.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo: File, index: number) => (
              <div key={index} className="relative">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Backyard ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Processing component
interface ProcessingViewProps {
  progress?: number;
}

function ProcessingView({ progress = 0 }: ProcessingViewProps) {
  const stages = [
    { name: 'Analyzing photos', progress: 25 },
    { name: 'Creating 3D model', progress: 50 },
    { name: 'Detecting features', progress: 75 },
    { name: 'Optimizing design', progress: 100 }
  ];
  
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="space-y-6">
        <div className="text-6xl">🤖</div>
        <h2 className="text-3xl font-bold text-gray-800">AI Creating Your 3D Space</h2>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-xl text-gray-600">{progress}% Complete</div>
        
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.name} className="flex items-center justify-between">
              <span className={`text-left ${progress >= stage.progress ? 'text-green-600' : 'text-gray-400'}`}>
                {progress >= stage.progress ? '✓' : '⏳'} {stage.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">
            💡 <strong>Pro Tip:</strong> Pool placement depends on sun exposure, access, and local building codes
          </p>
        </div>
      </div>
    </div>
  );
}

// Design controls
interface DesignControlsProps {
  designData: DesignData;
  onUpdate: (category: string, property: string, value: string | number) => void;
  onExport: (type: string) => void;
}

function DesignControls({ designData, onUpdate, onExport }: DesignControlsProps) {
  const [activeTab, setActiveTab] = useState('pool');
  
  const poolShapes = ['rectangle', 'kidney', 'freeform', 'L-shape'];
  const poolColors = ['#0066cc', '#004080', '#6699ff', '#003366'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="flex space-x-4 border-b">
          {['pool', 'deck', 'materials'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Pool controls */}
        {activeTab === 'pool' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🏊 Pool Design</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Shape</label>
              <div className="grid grid-cols-2 gap-2">
                {poolShapes.map(shape => (
                  <button
                    key={shape}
                    onClick={() => onUpdate('pool', 'shape', shape)}
                    className={`p-2 rounded capitalize ${
                      designData.pool?.shape === shape 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>Length:</span>
                  <input 
                    type="range" 
                    min="12" 
                    max="40" 
                    value={designData.pool?.size[0] || 16}
                    onChange={(e) => onUpdate('pool', 'length', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span>{designData.pool?.size[0] || 16}ft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Width:</span>
                  <input 
                    type="range" 
                    min="8" 
                    max="20" 
                    value={designData.pool?.size[1] || 8}
                    onChange={(e) => onUpdate('pool', 'width', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span>{designData.pool?.size[1] || 8}ft</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Water Color</label>
              <div className="flex space-x-2">
                {poolColors.map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdate('pool', 'color', color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      designData.pool?.color === color 
                        ? 'border-gray-800' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <p className="text-green-800 font-medium">
                💰 Estimated Cost: ${((designData.pool?.size[0] || 16) * (designData.pool?.size[1] || 8) * 150).toLocaleString()}
              </p>
            </div>
          </div>
        )}
        
        {/* Export controls */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onExport('image')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              📸 Save Image
            </button>
            <button 
              onClick={() => onExport('ar')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              📱 AR View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Type definitions
interface PoolData {
  position: [number, number, number];
  size: [number, number, number];
  shape: string;
  color: string;
}

interface DeckData {
  position: [number, number, number];
  size: [number, number];
  material: string;
}

interface DesignData {
  pool: PoolData | null;
  deck: DeckData | null;
  backyard: {
    dimensions: { length: number; width: number };
  };
}

// Main application
export default function BackyardAI() {
  const [step, setStep] = useState('upload'); // upload, processing, design
  const [photos, setPhotos] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [designData, setDesignData] = useState<DesignData>({
    pool: {
      position: [0, 0, 0],
      size: [16, 8, 6],
      shape: 'rectangle',
      color: '#0066cc'
    },
    deck: null,
    backyard: {
      dimensions: { length: 40, width: 30 }
    }
  });

  const handlePhotosUpload = useCallback((acceptedFiles: File[]) => {
    setPhotos(acceptedFiles);
  }, []);

  const handleProcessPhotos = useCallback(async () => {
    setStep('processing');
    
    // Simulate AI processing with progress updates
    const stages = [25, 50, 75, 100];
    for (const targetProgress of stages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(targetProgress);
    }
    
    // Simulate AI results (in real app, this would be actual AI processing)
    setDesignData(prev => ({
      ...prev,
      pool: prev.pool ? {
        ...prev.pool,
        position: [2, 0, 5] // AI-suggested optimal position
      } : null
    }));
    
    setStep('design');
  }, []);

  const handleDesignUpdate = useCallback((category: string, property: string, value: string | number) => {
    setDesignData(prev => {
      if (category === 'pool' && prev.pool) {
        const updatedPool = { ...prev.pool };
        if (property === 'length') {
          updatedPool.size = [value as number, updatedPool.size[1], updatedPool.size[2]];
        } else if (property === 'width') {
          updatedPool.size = [updatedPool.size[0], value as number, updatedPool.size[2]];
        } else {
          (updatedPool as Record<string, unknown>)[property] = value;
        }
        return { ...prev, pool: updatedPool };
      }
      return prev;
    });
  }, []);

  const handleExport = useCallback((type: string) => {
    if (type === 'image') {
      // In real app, capture canvas as image
      alert('Image saved! (In production, this would download a high-res image)');
    } else if (type === 'ar') {
      // In real app, open AR viewer
      alert('AR View! (In production, this would open mobile AR viewer)');
    }
  }, []);

  const handlePoolSelect = useCallback(() => {
    console.log('Pool selected');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600">BackyardAI</h1>
              <p className="ml-4 text-gray-600">Pool Design in Minutes</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Step {step === 'upload' ? '1' : step === 'processing' ? '2' : '3'} of 3</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Design Your Dream Pool
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Upload photos and see your backyard transformed in minutes
              </p>
            </div>
            
            <PhotoUpload onUpload={handlePhotosUpload} photos={photos} />
            
            {photos.length > 0 && (
              <div className="text-center">
                <button 
                  onClick={handleProcessPhotos}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create My Pool Design →
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Processing takes 2-3 minutes
                </p>
              </div>
            )}
          </div>
        )}
        
        {step === 'processing' && (
          <ProcessingView progress={progress} />
        )}
        
        {step === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 3D Viewer */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-96 lg:h-[600px]">
                  <Canvas camera={{ position: [25, 15, 25], fov: 50 }}>
                    <Suspense fallback={null}>
                      <Scene 
                        designData={designData} 
                        onPoolSelect={handlePoolSelect}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      🎮 Drag to rotate • Scroll to zoom • Right-click to pan
                    </div>
                    <div className="text-sm font-medium">
                      Backyard: {designData.backyard.dimensions.length}&apos; × {designData.backyard.dimensions.width}&apos;
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="lg:col-span-1">
              <DesignControls 
                designData={designData}
                onUpdate={handleDesignUpdate}
                onExport={handleExport}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 text-center text-gray-600">
          <p>© 2025 BackyardAI - Revolutionary Pool Design • Built with AI</p>
        </div>
      </footer>
    </div>
  );
}