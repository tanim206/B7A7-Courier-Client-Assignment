export function AboutPage() {
  return (
    <div className="bg-white text-slate-900">
      {/* 1. Header / Intro Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-orange-200">
              About SWIFTCONNECT
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Since 2016, to every <br />
              <span className="text-orange-500">doorstep in the country</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-4 leading-relaxed">
              SwiftConnect Courier is one of the largest e-commerce logistics
              networks in Bangladesh, daily pickup, cash on delivery and
              next-day payout, for a single shop and for national brands alike.
            </p>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              In every zone of the 64 districts, from upazila to union down to
              the union, our network is reaching every edge.
            </p>
          </div>
          <div className="bg-orange-50/50 p-6 sm:p-8 rounded-3xl border border-orange-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 text-white rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold shadow-lg shadow-orange-500/30 mb-4">
                🚚
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Nationwide Network
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Connecting 64 districts seamlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Bar */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <h2 className="text-4xl font-extrabold text-orange-500 mb-2">
                300,000+
              </h2>
              <p className="text-sm font-medium text-slate-300">
                Registered Merchants
              </p>
            </div>
            <div className="p-4 border-y sm:border-y-0 sm:border-x border-slate-800">
              <h2 className="text-4xl font-extrabold text-orange-500 mb-2">
                7,500+
              </h2>
              <p className="text-sm font-medium text-slate-300">
                Delivery Personnel
              </p>
            </div>
            <div className="p-4">
              <h2 className="text-4xl font-extrabold text-orange-500 mb-2">
                1,000+
              </h2>
              <p className="text-sm font-medium text-slate-300">
                Delivery Points
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Our Mission
            </h3>
            <p className="text-slate-600 leading-relaxed">
              To put a smile on your face with fast, secure and reliable
              doorstep deliveries across the country.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
              👁️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Our Vision
            </h3>
            <p className="text-slate-600 leading-relaxed">
              To manage e-commerce logistics in Bangladesh through high
              technology and superior service standards.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What We Do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
          What we do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-slate-900 text-lg mb-2">
              E-commerce delivery
            </h4>
            <p className="text-sm text-slate-600">
              Online orders, cash on delivery in any address in the country.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-slate-900 text-lg mb-2">
              Pick and drop
            </h4>
            <p className="text-sm text-slate-600">
              Parcel to vendors, door to door.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-slate-900 text-lg mb-2">Packaging</h4>
            <p className="text-sm text-slate-600">
              Safe packaging for delivery of fragile items.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-slate-900 text-lg mb-2">
              Warehousing
            </h4>
            <p className="text-sm text-slate-600">
              Your product, our warehouse, put that out for instant market
              access.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Started */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-orange-50/40 rounded-3xl p-8 sm:p-12 border border-orange-100">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              How it started
            </h2>
            <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
              It began in Dhaka in 2016 with a handful of riders and one
              promise: arrive when we said we would. Today eight divisional
              hubs, a thousand delivery points and 7,500 people keep that same
              promise.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
          Leadership
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 font-bold">
              Photo
            </div>
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Founder and Managing Director
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                Hussen Md. Tanim
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A pioneer in courier, focused in Dhaka in 2016 and two small
                rooms in mayur purnia. From a handful of domain to network
                expansion across the country.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 font-bold">
              Photo
            </div>
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Chairman
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                Jolexia Mcatary
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                As Chairman, leads SwiftConnect Courier to set standards. The
                company's backbone where the return goes and asset property is
                our plan in every delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
