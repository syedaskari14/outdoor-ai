import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Box, Plane } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

// Pool component with realistic materials
function Pool({ position = [0, 0, 0], size = [16, 8, 6], color = '#0066cc', onSelect }) {
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

// Ground plane
function Ground() {
  return (
    <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <meshStandardMaterial color="#228B22" roughness={0.9} />
    </Plane>
  );
}

// 3D Scene component
function Scene({ designData, onPoolSelect }) {
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
function PhotoUpload({ onUpload, photos }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: onUpload
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div 
        {...getRootProps()} 
        style={{
          border: '2px dashed #3b82f6',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragActive ? '#dbeafe' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📸</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
          Upload Backyard Photos
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Drop 5-10 photos or click to browse
        </p>
        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
          <p>✓ Take photos from different angles</p>
          <p>✓ Include all corners of your yard</p>
          <p>✓ Good lighting preferred</p>
          <p>✓ Show existing features (doors, windows, fences)</p>
        </div>
      </div>
      
      {photos.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px' }}>
            Uploaded Photos ({photos.length})
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            {photos.map((photo, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Backyard ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '8px' 
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
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
function ProcessingView({ progress = 0 }) {
  const stages = [
    { name: 'Analyzing photos', progress: 25 },
    { name: 'Creating 3D model', progress: 50 },
    { name: 'Detecting features', progress: 75 },
    { name: 'Optimizing design', progress: 100 }
  ];
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🤖</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#374151', marginBottom: '30px' }}>
        AI Creating Your 3D Space
      </h2>
      
      <div style={{ 
        width: '100%', 
        backgroundColor: '#e5e7eb', 
        borderRadius: '50px',
        height: '16px',
        marginBottom: '20px'
      }}>
        <div 
          style={{ 
            backgroundColor: '#3b82f6',
            height: '16px',
            borderRadius: '50px',
            transition: 'width 0.5s ease',
            width: `${progress}%`
          }}
        />
      </div>
      
      <div style={{ fontSize: '1.5rem', color: '#6b7280', marginBottom: '30px' }}>
        {progress}% Complete
      </div>
      
      <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
        {stages.map((stage) => (
          <div key={stage.name} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px',
            color: progress >= stage.progress ? '#10b981' : '#9ca3af'
          }}>
            <span style={{ marginRight: '10px' }}>
              {progress >= stage.progress ? '✓' : '⏳'}
            </span>
            <span>{stage.name}</span>
          </div>
        ))}
      </div>
      
      <div style={{ 
        backgroundColor: '#dbeafe', 
        padding: '20px', 
        borderRadius: '12px',
        marginTop: '30px'
      }}>
        <p style={{ color: '#1e40af', fontWeight: '600' }}>
          💡 Pro Tip: Pool placement depends on sun exposure, access, and local building codes
        </p>
      </div>
    </div>
  );
}

// Design controls
function DesignControls({ designData, onUpdate, onExport }) {
  const [activeTab, setActiveTab] = useState('pool');
  
  const poolShapes = ['rectangle', 'kidney', 'freeform', 'L-shape'];
  const poolColors = ['#0066cc', '#004080', '#6699ff', '#003366'];
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    }}>
      {/* Tab navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '30px'
      }}>
        {['pool', 'materials'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              paddingBottom: '10px',
              textTransform: 'capitalize',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              color: activeTab === tab ? '#3b82f6' : '#6b7280',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Pool controls */}
      {activeTab === 'pool' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
            🏊 Pool Design
          </h3>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>
              Shape
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {poolShapes.map(shape => (
                <button
                  key={shape}
                  onClick={() => onUpdate('pool', 'shape', shape)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                    border: '1px solid #e5e7eb',
                    backgroundColor: designData.pool?.shape === shape ? '#3b82f6' : '#f9fafb',
                    color: designData.pool?.shape === shape ? 'white' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>
              Size
            </label>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ minWidth: '60px' }}>Length:</span>
                <input 
                  type="range" 
                  min="12" 
                  max="40" 
                  value={designData.pool?.size[0] || 16}
                  onChange={(e) => onUpdate('pool', 'length', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '40px' }}>{designData.pool?.size[0] || 16}ft</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ minWidth: '60px' }}>Width:</span>
                <input 
                  type="range" 
                  min="8" 
                  max="20" 
                  value={designData.pool?.size[1] || 8}
                  onChange={(e) => onUpdate('pool', 'width', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '40px' }}>{designData.pool?.size[1] || 8}ft</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>
              Water Color
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {poolColors.map(color => (
                <button
                  key={color}
                  onClick={() => onUpdate('pool', 'color', color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: designData.pool?.color === color ? '3px solid #374151' : '2px solid #e5e7eb',
                    backgroundColor: color,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
            <p style={{ color: '#166534', fontWeight: '600', margin: 0 }}>
              💰 Estimated Cost: ${((designData.pool?.size[0] || 16) * (designData.pool?.size[1] || 8) * 150).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      {/* Export controls */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <button 
            onClick={() => onExport('image')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📸 Save Image
          </button>
          <button 
            onClick={() => onExport('ar')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📱 AR View
          </button>
        </div>
      </div>
    </div>
  );
}

// Main application
export default function BackyardAI() {
  const [step, setStep] = useState('upload'); // upload, processing, design
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [designData, setDesignData] = useState({
    pool: {
      position: [0, 0, 0],
      size: [16, 8, 6],
      shape: 'rectangle',
      color: '#0066cc'
    },
    backyard: {
      dimensions: { length: 40, width: 30 }
    }
  });

  const handlePhotosUpload = useCallback((acceptedFiles) => {
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
      pool: {
        ...prev.pool,
        position: [2, 0, 5] // AI-suggested optimal position
      }
    }));
    
    setStep('design');
  }, []);

  const handleDesignUpdate = useCallback((category, property, value) => {
    setDesignData(prev => {
      if (category === 'pool' && prev.pool) {
        const updatedPool = { ...prev.pool };
        if (property === 'length') {
          updatedPool.size = [value, updatedPool.size[1], updatedPool.size[2]];
        } else if (property === 'width') {
          updatedPool.size = [updatedPool.size[0], value, updatedPool.size[2]];
        } else {
          updatedPool[property] = value;
        }
        return { ...prev, pool: updatedPool };
      }
      return prev;
    });
  }, []);

  const handleExport = useCallback((type) => {
    if (type === 'image') {
      alert('Image saved! (In production, this would download a high-res image)');
    } else if (type === 'ar') {
      alert('AR View! (In production, this would open mobile AR viewer)');
    }
  }, []);

  const handlePoolSelect = useCallback(() => {
    console.log('Pool selected');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#2563eb',
              margin: 0,
              marginRight: '20px'
            }}>
              BackyardAI
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pool Design in Minutes</p>
          </div>
          <div>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>
              Step {step === 'upload' ? '1' : step === 'processing' ? '2' : '3'} of 3
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {step === 'upload' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '20px'
              }}>
                Design Your Dream Pool
              </h2>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#6b7280',
                marginBottom: '40px'
              }}>
                Upload photos and see your backyard transformed in minutes
              </p>
            </div>
            
            <PhotoUpload onUpload={handlePhotosUpload} photos={photos} />
            
            {photos.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  onClick={handleProcessPhotos}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Create My Pool Design →
                </button>
                <p style={{ 
                  marginTop: '10px', 
                  fontSize: '14px', 
                  color: '#9ca3af' 
                }}>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            '@media (max-width: 1024px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            {/* 3D Viewer */}
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div style={{ height: '600px' }}>
                  <Canvas camera={{ position: [25, 15, 25], fov: 50 }}>
                    <Suspense fallback={null}>
                      <Scene 
                        designData={designData} 
                        onPoolSelect={handlePoolSelect}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      🎮 Drag to rotate • Scroll to zoom • Right-click to pan
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      Backyard: {designData.backyard.dimensions.length}&apos; × {designData.backyard.dimensions.width}&apos;
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div>
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
      <footer style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px 20px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>© 2025 BackyardAI - Revolutionary Pool Design • Built with AI</p>
        </div>
      </footer>
    </div>
  );
}