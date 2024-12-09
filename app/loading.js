export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsating Glow */}
        <div className="absolute w-36 h-36 rounded-full bg-purple-300 opacity-70 blur-lg animate-pulse"></div>

        {/* Middle Rotating Gradient Ring */}
        <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Inner Expanding Dots */}
        <div className="absolute flex space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-75"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Center Static Core */}
        <div className="z-10 h-12 w-12 bg-white rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
