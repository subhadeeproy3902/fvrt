"use client";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden relative group">
        <span className="text-2xl font-extrabold z-10 transition-transform duration-300">
          F
        </span>
        <span className="absolute -bottom-3 -right-3 text-5xl font-black text-orange-300 opacity-50 group-hover:opacity-70 transition-opacity duration-300">vrt</span>
      </div>
      <span className="text-xl font-bold tracking-wider">vrt</span>
    </div>
  );
}
