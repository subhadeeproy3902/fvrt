import Logo from "@/components/Logo";
import FileConverter from "@/components/FileConverter";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 z-50">
        <div className="mb-16">
          <Logo />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold sm:text-5xl bg-gradient-to-b from-orange-400 to-amber-200 bg-clip-text text-transparent">
            Convert{" "}
            <span className="inline-block bg-orange-200/90 border border-primary/50 px-5 py-1.5 rounded-lg -rotate-3 hover:rotate-0 transition-transform duration-300 text-orange-400">
              Images
            </span>{" "}
            Instantly
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your images to any format with our powerful converter.
            Support for JPG, PNG, WEBP, and more. Fast, secure, and completely
            free.
          </p>
        </div>

        <FileConverter />
        <Features />
      </div>
    </main>
  );
}
