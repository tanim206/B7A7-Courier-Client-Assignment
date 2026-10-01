import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated / Styled 404 Badge */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
          </div>
          <h1 className="relative text-7xl sm:text-8xl font-extrabold text-orange-500 tracking-widest">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200">
            Page Not Found
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Oops! Looks like you are off-route.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-center text-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 transition-all text-center text-sm"
          >
            Contact Support
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-8 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SWIFTCONNECT Courier Ltd. All rights
          reserved.
        </div>
      </div>
    </div>
  );
}
