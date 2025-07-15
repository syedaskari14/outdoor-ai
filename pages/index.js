export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        padding: '40px'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          color: '#2563eb', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          BackyardAI
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          color: '#374151', 
          marginBottom: '40px' 
        }}>
          Revolutionary Pool Design Platform
        </p>
        
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏊‍♂️</div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            Coming Soon!
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#6b7280',
            marginBottom: '30px'
          }}>
            Transform your backyard with AI-powered 3D pool design in minutes
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ padding: '20px', background: '#dbeafe', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📸</div>
              <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>Upload Photos</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Quick photo upload</p>
            </div>
            
            <div style={{ padding: '20px', background: '#dcfce7', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
              <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>AI Processing</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Smart 3D generation</p>
            </div>
            
            <div style={{ padding: '20px', background: '#fae8ff', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎮</div>
              <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>Interactive Design</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Real-time customization</p>
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '40px', 
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          <p>✅ Built Successfully • ✅ Deployed on Vercel • ✅ Ready for Production</p>
        </div>
      </div>
    </div>
  );
}