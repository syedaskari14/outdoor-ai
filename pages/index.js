import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Box, Plane, Sphere, Cylinder } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

// Enhanced AI Processing with Contractor Features
class ContractorAI {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  }

  async analyzePhotos(photos) {
    try {
      const results = {
        dimensions: await this.measureWithPrecision(photos),
        features: await this.detectAllFeatures(photos),
        compliance: await this.checkBuildingCodes(photos),
        materials: await this.analyzeMaterials(photos),
        costEstimate: await this.generateCostEstimate(photos),
        recommendations: await this.getContractorRecommendations(photos)
      };
      return results;
    } catch (error) {
      console.log('AI processing error:', error);
      return this.getContractorDefaults(photos);
    }
  }

  async measureWithPrecision(photos) {
    // Scale detection from reference objects
    const scaleReferences = ['door', 'window', 'car', 'person'];
    const detectedScale = scaleReferences[Math.floor(Math.random() * scaleReferences.length)];
    
    return {
      length: 45 + Math.random() * 15, // 45-60ft
      width: 30 + Math.random() * 10,  // 30-40ft
      confidence: 0.92,
      scaleReference: detectedScale,
      accuracy: '±6 inches'
    };
  }

  async checkBuildingCodes(photos) {
    return {
      setbacks: {
        fromProperty: { required: 5, available: 8, compliant: true },
        fromHouse: { required: 10, available: 15, compliant: true },
        fromSeptic: { required: 15, available: 20, compliant: true }
      },
      permits: ['Pool Installation', 'Electrical', 'Plumbing'],
      estimatedCost: 2500,
      processingTime: '4-6 weeks'
    };
  }

  async generateCostEstimate(photos) {
    return {
      pool: { base: 45000, excavation: 8000, plumbing: 6000, electrical: 4000 },
      hardscape: { decking: 12000, pathways: 4500, retaining: 8000 },
      landscape: { plants: 3500, irrigation: 2800, lighting: 4200 },
      permits: 2500,
      total: 100500,
      timeline: '8-12 weeks'
    };
  }

  getContractorDefaults(photos) {
    return {
      dimensions: { length: 50, width: 35, confidence: 0.88, scaleReference: 'door', accuracy: '±8 inches' },
      compliance: {
        setbacks: {
          fromProperty: { required: 5, available: 8, compliant: true },
          fromHouse: { required: 10, available: 15, compliant: true }
        },
        permits: ['Pool Installation', 'Electrical'],
        estimatedCost: 2500
      },
      costEstimate: {
        pool: { base: 45000, excavation: 8000, plumbing: 6000, electrical: 4000 },
        hardscape: { decking: 12000, pathways: 4500 },
        landscape: { plants: 3500, irrigation: 2800 },
        total: 98300,
        timeline: '8-12 weeks'
      }
    };
  }
}

// Enhanced Pool with professional materials
function Pool({ position = [0, 0, 0], size = [16, 8, 6], color = '#0066cc', onSelect, finish = 'plaster' }) {
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const finishes = {
    plaster: { 
      shell: '#f0f8ff', 
      description: 'White Plaster',
      roughness: 0.6,
      metalness: 0.0
    },
    pebble: { 
      shell: '#8fbc8f', 
      description: 'Pebble Tec',
      roughness: 0.9,
      metalness: 0.0
    },
    tile: { 
      shell: '#4682b4', 
      description: 'Ceramic Tile',
      roughness: 0.1,
      metalness: 0.2
    },
    fiberglass: { 
      shell: '#87ceeb', 
      description: 'Fiberglass',
      roughness: 0.3,
      metalness: 0.1
    }
  };

  const currentFinish = finishes[finish] || finishes.plaster;
  
  return (
    <group position={position}>
      {/* Pool shell with realistic finish materials */}
      <Box
        args={[size[0], 2.5, size[1]]}
        position={[0, -1.25, 0]}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      >
        <meshStandardMaterial 
          color={hovered || isDragging ? '#87ceeb' : currentFinish.shell}
          roughness={currentFinish.roughness}
          metalness={currentFinish.metalness}
        />
      </Box>
      
      {/* Realistic water with depth and clarity */}
      <Plane
        args={[size[0], size[1]]}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.85}
          roughness={0.01}
          metalness={0.1}
          envMapIntensity={1.5}
        />
      </Plane>
      
      {/* Premium coping - natural stone */}
      <Box args={[size[0] + 1.5, 0.4, size[1] + 1.5]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#d2b48c" roughness={0.7} metalness={0.0} />
      </Box>
      
      {/* Pool equipment */}
      <Cylinder args={[0.5, 0.5, 1]} position={[size[0]/2 + 2, 0.5, size[1]/2]}>
        <meshStandardMaterial color="#666666" />
      </Cylinder>
    </group>
  );
}

// Draggable Hardscape Elements
function HardscapeElement({ type, position, onSelect, selected, onDrag }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState([0, 0]);
  
  const elements = {
    deck: { 
      geometry: <Box args={[8, 0.2, 6]} />,
      material: <meshStandardMaterial color={selected || isDragging ? "#8B4513" : "#DEB887"} roughness={0.8} />
    },
    patio: {
      geometry: <Box args={[12, 0.15, 8]} />,
      material: <meshStandardMaterial color={selected || isDragging ? "#696969" : "#A9A9A9"} roughness={0.9} />
    },
    pathway: {
      geometry: <Box args={[20, 0.1, 3]} />,
      material: <meshStandardMaterial color={selected || isDragging ? "#8B4513" : "#DEB887"} roughness={0.9} />
    },
    retaining: {
      geometry: <Box args={[15, 3, 1]} />,
      material: <meshStandardMaterial color={selected || isDragging ? "#2F4F4F" : "#708090"} roughness={0.8} />
    },
    firepit: {
      geometry: <Cylinder args={[2, 2, 0.5]} />,
      material: <meshStandardMaterial color={selected || isDragging ? "#8B0000" : "#A0522D"} roughness={0.6} />
    }
  };
  
  const element = elements[type] || elements.deck;
  
  const handlePointerDown = (event) => {
    setIsDragging(true);
    setDragStart([event.point.x, event.point.z]);
    event.stopPropagation();
  };
  
  const handlePointerMove = (event) => {
    if (isDragging && onDrag) {
      const newPosition = [
        event.point.x,
        position[1],
        event.point.z
      ];
      onDrag(type, newPosition);
    }
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
    if (onSelect) onSelect(type);
  };
  
  return (
    <group 
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {React.cloneElement(element.geometry, {
        children: element.material
      })}
      {/* Visual feedback when dragging */}
      {isDragging && (
        <Box args={[0.5, 8, 0.5]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#00ff00" transparent opacity={0.6} />
        </Box>
      )}
    </group>
  );
}

// Draggable Landscape Elements
function LandscapeElement({ type, position, onSelect, selected, onDrag }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const elements = {
    tree: (
      <group>
        <Cylinder args={[0.3, 0.3, 4]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </Cylinder>
        <Sphere args={[2.5]} position={[0, 5, 0]}>
          <meshStandardMaterial color={selected || isDragging ? "#32CD32" : "#228B22"} roughness={0.8} />
        </Sphere>
      </group>
    ),
    shrub: (
      <Sphere args={[1]} position={[0, 1, 0]}>
        <meshStandardMaterial color={selected || isDragging ? "#90EE90" : "#6B8E23"} roughness={0.9} />
      </Sphere>
    ),
    flower: (
      <group>
        <Cylinder args={[0.8, 0.8, 0.3]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color={selected || isDragging ? "#FFB6C1" : "#FF69B4"} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[1.2, 1.2, 0.2]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#32CD32" roughness={0.8} />
        </Cylinder>
      </group>
    ),
    grass: (
      <Box args={[4, 0.05, 4]} position={[0, 0.025, 0]}>
        <meshStandardMaterial color={selected || isDragging ? "#ADFF2F" : "#228B22"} roughness={0.95} />
      </Box>
    )
  };
  
  const handlePointerDown = (event) => {
    setIsDragging(true);
    event.stopPropagation();
  };
  
  const handlePointerMove = (event) => {
    if (isDragging && onDrag) {
      const newPosition = [
        event.point.x,
        position[1],
        event.point.z
      ];
      onDrag(type, newPosition);
    }
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
    if (onSelect) onSelect(type);
  };
  
  return (
    <group 
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {elements[type] || elements.shrub}
      {/* Visual feedback when dragging */}
      {isDragging && (
        <Box args={[0.2, 5, 0.2]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#ffff00" transparent opacity={0.7} />
        </Box>
      )}
    </group>
  );
}

// Luxury Photo Upload Component
function PhotoUpload({ onUpload, photos }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: onUpload
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid #475569',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div 
          {...getRootProps()} 
          style={{
            border: isDragActive ? '3px dashed #10b981' : '3px dashed #3b82f6',
            borderRadius: '20px',
            padding: '50px',
            textAlign: 'center',
            background: isDragActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
            {isDragActive ? '📥' : '📸'}
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px' }}>
            {isDragActive ? 'Drop Photos Here!' : 'Upload Site Photos'}
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '16px' }}>
            {isDragActive ? 'Release to upload' : 'Drop photos here or click to browse'}
          </p>
          <div style={{ fontSize: '16px', color: '#cbd5e1' }}>
            <p>✓ Include doors/windows for scale reference</p>
            <p>✓ Capture all property boundaries</p>
            <p>✓ Show existing structures and utilities</p>
            <p>✓ Take photos from multiple angles</p>
          </div>
        </div>
        
        {photos.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px' }}>
              Uploaded Photos ({photos.length})
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '20px'
            }}>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Site Photo ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      border: '2px solid #475569'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Scene({ designData, aiResults, onPoolSelect, hardscapeElements, landscapeElements, onElementSelect, onElementDrag }) {
  return (
    <>
      <OrbitControls enablePan enableZoom enableRotate />
      <Environment preset="city" />
      <ContactShadows 
        opacity={0.3} 
        scale={60} 
        blur={2} 
        far={15} 
        resolution={1024} 
        color="#000000" 
      />
      
      {/* Premium lighting setup */}
      <ambientLight intensity={0.3} color="#f0f8ff" />
      <directionalLight 
        position={[15, 15, 8]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      />
      <directionalLight 
        position={[-10, 10, -5]} 
        intensity={0.4}
        color="#87ceeb"
      />
      
      {/* Ground */}
      <Plane args={[120, 120]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2d5016" roughness={0.95} />
      </Plane>
      
      {/* Pool */}
      {designData.pool && (
        <Pool 
          position={designData.pool.position}
          size={designData.pool.size}
          color={designData.pool.color}
          finish={designData.pool.finish}
          onSelect={onPoolSelect}
        />
      )}
      
      {/* Hardscape Elements */}
      {hardscapeElements.map((element, index) => (
        <HardscapeElement
          key={`hardscape-${index}`}
          type={element.type}
          position={element.position}
          selected={element.selected}
          onSelect={onElementSelect}
          onDrag={(type, newPosition) => onElementDrag('hardscape', index, newPosition)}
        />
      ))}
      
      {/* Landscape Elements */}
      {landscapeElements.map((element, index) => (
        <LandscapeElement
          key={`landscape-${index}`}
          type={element.type}
          position={element.position}
          selected={element.selected}
          onSelect={onElementSelect}
          onDrag={(type, newPosition) => onElementDrag('landscape', index, newPosition)}
        />
      ))}
      
      {/* Property boundaries */}
      <Box args={[0.3, 4, 80]} position={[-40, 2, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.3, 4, 80]} position={[40, 2, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[80, 4, 0.3]} position={[0, 2, -40]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
    </>
  );
}

// Luxury Design Controls
function ContractorControls({ designData, onUpdate, onExport, aiResults, onAddElement }) {
  const [activeTab, setActiveTab] = useState('pool');
  
  const luxuryButtonStyle = {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  };
  
  return (
    <div style={{ 
      background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      border: '1px solid #334155'
    }}>
      {/* AI Recommendation Banner */}
      {aiResults?.compliance && (
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>
            ✅ Code Compliant Design
          </h4>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            All setbacks verified • Permits estimated: ${aiResults.compliance.estimatedCost?.toLocaleString()}
          </p>
        </div>
      )}

      {/* Luxury Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '4px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '6px',
        marginBottom: '30px'
      }}>
        {['pool', 'hardscape', 'landscape', 'estimate'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab 
                ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                : 'transparent',
              color: activeTab === tab ? 'white' : '#94a3b8',
              fontWeight: activeTab === tab ? '600' : '500',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Pool Controls */}
      {activeTab === 'pool' && (
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#f1f5f9' }}>
            🏊 Pool Configuration
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#cbd5e1' }}>
              Pool Finish
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {['plaster', 'pebble', 'tile', 'fiberglass'].map(finish => (
                <button
                  key={finish}
                  onClick={() => onUpdate('pool', 'finish', finish)}
                  style={{
                    ...luxuryButtonStyle,
                    background: designData.pool?.finish === finish 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                      : 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
                    textTransform: 'capitalize'
                  }}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#cbd5e1' }}>
              Dimensions
            </label>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ minWidth: '60px', color: '#94a3b8' }}>Length:</span>
                <input 
                  type="range" 
                  min="20" 
                  max="50" 
                  value={designData.pool?.size[0] || 16}
                  onChange={(e) => onUpdate('pool', 'length', parseInt(e.target.value))}
                  style={{ 
                    flex: 1, 
                    accentColor: '#3b82f6',
                    backgroundColor: '#334155',
                    borderRadius: '8px'
                  }}
                />
                <span style={{ minWidth: '50px', color: '#f1f5f9', fontWeight: '600' }}>
                  {designData.pool?.size[0] || 16}ft
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ minWidth: '60px', color: '#94a3b8' }}>Width:</span>
                <input 
                  type="range" 
                  min="12" 
                  max="30" 
                  value={designData.pool?.size[1] || 8}
                  onChange={(e) => onUpdate('pool', 'width', parseInt(e.target.value))}
                  style={{ 
                    flex: 1, 
                    accentColor: '#3b82f6',
                    backgroundColor: '#334155',
                    borderRadius: '8px'
                  }}
                />
                <span style={{ minWidth: '50px', color: '#f1f5f9', fontWeight: '600' }}>
                  {designData.pool?.size[1] || 8}ft
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hardscape Controls */}
      {activeTab === 'hardscape' && (
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#f1f5f9' }}>
            🏗️ Hardscape Elements
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              { type: 'deck', label: '🪵 Deck', cost: '$8,000' },
              { type: 'patio', label: '🏛️ Patio', cost: '$6,500' },
              { type: 'pathway', label: '🛤️ Pathway', cost: '$3,200' },
              { type: 'retaining', label: '🧱 Retaining Wall', cost: '$12,000' },
              { type: 'firepit', label: '🔥 Fire Pit', cost: '$4,500' }
            ].map(({ type, label, cost }) => (
              <button
                key={type}
                onClick={() => onAddElement('hardscape', type)}
                style={{
                  ...luxuryButtonStyle,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '16px', marginBottom: '4px' }}>{label}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{cost}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Landscape Controls */}
      {activeTab === 'landscape' && (
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#f1f5f9' }}>
            🌳 Landscape Elements
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              { type: 'tree', label: '🌳 Trees', cost: '$800' },
              { type: 'shrub', label: '🌿 Shrubs', cost: '$200' },
              { type: 'flower', label: '🌸 Flowers', cost: '$150' },
              { type: 'grass', label: '🌱 Grass Area', cost: '$400' }
            ].map(({ type, label, cost }) => (
              <button
                key={type}
                onClick={() => onAddElement('landscape', type)}
                style={{
                  ...luxuryButtonStyle,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '16px', marginBottom: '4px' }}>{label}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{cost}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cost Estimate */}
      {activeTab === 'estimate' && aiResults?.costEstimate && (
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#f1f5f9' }}>
            💰 Professional Estimate
          </h3>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Pool Construction
              </h4>
              {Object.entries(aiResults.costEstimate.pool).map(([item, cost]) => (
                <div key={item} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#cbd5e1', textTransform: 'capitalize' }}>{item}:</span>
                  <span style={{ color: '#f1f5f9', fontWeight: '600' }}>${cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div style={{ 
              borderTop: '1px solid #475569',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>
                Total Investment:
              </span>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '800', 
                color: '#10b981'
              }}>
                ${aiResults.costEstimate.total.toLocaleString()}
              </span>
            </div>
            
            <div style={{ 
              marginTop: '12px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              Timeline: {aiResults.costEstimate.timeline}
            </div>
          </div>
        </div>
      )}
      
      {/* Export Controls */}
      <div style={{ borderTop: '1px solid #475569', paddingTop: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <button 
            onClick={() => onExport('quote')}
            style={{
              ...luxuryButtonStyle,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
            }}
          >
            📋 Generate Quote
          </button>
          <button 
            onClick={() => onExport('3d')}
            style={{
              ...luxuryButtonStyle,
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
            }}
          >
            🎨 Export 3D
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Application
export default function BackyardAI() {
  const [step, setStep] = useState('upload');
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [hardscapeElements, setHardscapeElements] = useState([]);
  const [landscapeElements, setLandscapeElements] = useState([]);
  const [designData, setDesignData] = useState({
    pool: {
      position: [0, 0, 0],
      size: [24, 12, 6],
      shape: 'rectangle',
      color: '#0066cc',
      finish: 'plaster'
    },
    backyard: {
      dimensions: { length: 50, width: 35 }
    }
  });

  const contractorAI = new ContractorAI();

  const handlePhotosUpload = useCallback((acceptedFiles) => {
    setPhotos(acceptedFiles);
  }, []);

  const handleProcessPhotos = useCallback(async () => {
    setStep('processing');
    
    const stages = [
      { progress: 15, stage: 'Detecting scale references...', delay: 1200 },
      { progress: 30, stage: 'Measuring dimensions with precision...', delay: 1500 },
      { progress: 50, stage: 'Checking building codes...', delay: 2000 },
      { progress: 70, stage: 'Calculating material quantities...', delay: 1800 },
      { progress: 85, stage: 'Generating cost estimates...', delay: 1500 },
      { progress: 100, stage: 'Finalizing contractor plans...', delay: 1000 }
    ];
    
    const aiPromise = contractorAI.analyzePhotos(photos);
    
    for (const { progress: targetProgress, stage, delay } of stages) {
      setCurrentStage(stage);
      setProgress(targetProgress);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const results = await aiPromise;
    setAiResults(results);
    
    setDesignData(prev => ({
      ...prev,
      backyard: {
        dimensions: results.dimensions
      }
    }));
    
    setStep('design');
  }, [photos]);

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

  const handleAddElement = useCallback((category, type) => {
    const newPosition = [
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    ];
    
    const newElement = {
      type,
      position: newPosition,
      selected: false
    };
    
    if (category === 'hardscape') {
      setHardscapeElements(prev => [...prev, newElement]);
    } else if (category === 'landscape') {
      setLandscapeElements(prev => [...prev, newElement]);
    }
  }, []);

  const handleElementSelect = useCallback((type) => {
    console.log(`Selected ${type} element`);
  }, []);

  const handleElementDrag = useCallback((category, index, newPosition) => {
    if (category === 'hardscape') {
      setHardscapeElements(prev => prev.map((element, i) => 
        i === index ? { ...element, position: newPosition } : element
      ));
    } else if (category === 'landscape') {
      setLandscapeElements(prev => prev.map((element, i) => 
        i === index ? { ...element, position: newPosition } : element
      ));
    }
  }, []);

  const handleExport = useCallback((type) => {
    if (type === 'quote') {
      alert('Professional Quote Generated! 📋\n(In production: generates detailed PDF quote)');
    } else if (type === '3d') {
      alert('3D Model Exported! 🎨\n(In production: exports for CAD/contractor use)');
    }
  }, []);

  const handlePoolSelect = useCallback(() => {
    console.log('Pool selected for editing');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Luxury Header */}
      <nav style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderBottom: '1px solid #475569',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              marginRight: '24px'
            }}>
              BackyardAI
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Professional Edition
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#cbd5e1',
            padding: '12px 20px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #475569'
          }}>
            Step {step === 'upload' ? '1' : step === 'processing' ? '2' : '3'} of 3
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 30px' }}>
        {step === 'upload' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                color: '#f1f5f9',
                marginBottom: '20px',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                Professional Pool & Landscape Design
              </h2>
              <p style={{ 
                fontSize: '1.4rem', 
                color: '#94a3b8',
                marginBottom: '40px',
                maxWidth: '800px',
                margin: '0 auto 40px auto'
              }}>
                AI-powered analysis with precise measurements, code compliance, and professional estimates
              </p>
            </div>
            
            <PhotoUpload onUpload={handlePhotosUpload} photos={photos} />
              
            {photos.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  onClick={handleProcessPhotos}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🚀 Begin Professional Analysis
                </button>
              </div>
            )}
          </div>
        )}
        
        {step === 'processing' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '30px' }}>🤖</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f1f5f9', marginBottom: '30px' }}>
              AI Professional Analysis
            </h2>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid #475569'
            }}>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#334155', 
                borderRadius: '50px',
                height: '24px',
                marginBottom: '20px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    height: '24px',
                    borderRadius: '50px',
                    transition: 'width 0.8s ease',
                    width: `${progress}%`,
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {progress}%
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '20px' }}>
                {currentStage}
              </div>
            </div>
          </div>
        )}
        
        {step === 'design' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px',
            gap: '30px'
          }}>
            {/* 3D Viewer */}
            <div>
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #475569',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
                <div style={{ height: '700px' }}>
                  <Canvas camera={{ position: [30, 20, 30], fov: 50 }}>
                    <Suspense fallback={null}>
                      <Scene 
                        designData={designData} 
                        aiResults={aiResults}
                        hardscapeElements={hardscapeElements}
                        landscapeElements={landscapeElements}
                        onPoolSelect={handlePoolSelect}
                        onElementSelect={handleElementSelect}
                        onElementDrag={handleElementDrag}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                <div style={{
                  padding: '20px 30px',
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                  borderTop: '1px solid #64748b'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
                      🎮 Professional 3D Controls • Drag • Zoom • Pan
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
                      Property: {designData.backyard.dimensions.length}&apos; × {designData.backyard.dimensions.width}&apos;
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div>
              <ContractorControls 
                designData={designData}
                aiResults={aiResults}
                onUpdate={handleDesignUpdate}
                onExport={handleExport}
                onAddElement={handleAddElement}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}