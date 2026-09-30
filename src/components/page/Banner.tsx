export function Banner() {
  return (
    <div className="relative bg-white text-slate-900 overflow-hidden border-b border-slate-100">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content (Text & Call to Action) */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-orange-200">
            Fast & Secure Delivery
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-slate-900">
            RAPID, RELIABLE, <br />
            <span className="text-orange-500">GLOBAL LOGISTICS</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8">
            Four hundred and ninety-five upazilas, a thousand delivery points,
            seventy-five hundred people on the road — one network.
          </p>
        </div>

        {/* Right Content (Clean Image with White Background) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl flex items-center justify-center">
          <div className="relative w-full p-4  flex items-center justify-center">
            <img
              src="/assets/banner.png"
              alt="SWIFTCONNECT Delivery Vehicle"
              className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              ⚡ On-Time Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
