export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          BackyardAI
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Revolutionary Pool Design Platform
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            🏊‍♂️ Coming Soon!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Transform your backyard with AI-powered 3D pool design in minutes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-2xl mb-2">📸</div>
              <h3 className="font-semibold">Upload Photos</h3>
              <p className="text-sm text-gray-600">Quick photo upload</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold">AI Processing</h3>
              <p className="text-sm text-gray-600">Smart 3D generation</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-semibold">Interactive Design</h3>
              <p className="text-sm text-gray-600">Real-time customization</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-gray-500">
          <p>Built with Next.js • Deployed on Vercel • Ready for Production</p>
        </div>
      </div>
    </div>
  );
}