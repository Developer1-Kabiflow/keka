export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsating Glow */}
        <div className="absolute w-36 h-36 rounded-full bg-gray-400 opacity-50 blur-lg animate-pulse"></div>

        {/* Middle Rotating Ring */}
        <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-gray-500"></div>

        {/* Inner Expanding Dots */}
        <div className="absolute flex space-x-2">
          <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-75"></div>
          <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Center Static Core */}
        <div className="z-10 h-12 w-12 bg-gray-500 rounded-full shadow-md"></div>
      </div>
    </div>
  );
}
