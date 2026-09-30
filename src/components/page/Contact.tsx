export function ContactPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Talk to a person
        </h1>
        <p className="text-slate-600 text-base">
          One hotline for everything: tracking, deliveries, merchant accounts,
          complaints.
        </p>
      </section>

      {/* 2. Contact Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Hotline */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">
                📞
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Hotline</h3>
              <p className="text-xs text-slate-500 mb-4">
                Tracking, deliveries, merchant accounts, complaints
              </p>
            </div>
            <div>
              <a
                href="tel:09678045045"
                className="text-xl sm:text-2xl font-extrabold text-orange-500 hover:text-orange-600 transition-colors"
              >
                09678-045045
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold mb-4">
                💬
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Chat with us on WhatsApp
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                For a parcel you are expecting or sending, WhatsApp is often the
                quickest way to reach the support team.
              </p>
            </div>
            <div>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">
                ✉️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Email</h3>
              <p className="text-xs text-slate-500 mb-4">
                A reply within one working day
              </p>
            </div>
            <div>
              <a
                href="mailto:info@swiftconnect.com.bd"
                className="text-base sm:text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors"
              >
                info@swiftconnect.com.bd
              </a>
            </div>
          </div>

          {/* Card 4: Already a merchant */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">
                🔒
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Already a merchant?
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Open a support ticket from your dashboard so the team can see
                your account and parcels.
              </p>
            </div>
            <div>
              <a
                href="/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Sign in to open a ticket →
              </a>
            </div>
          </div>

          {/* Card 5: Head Office */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">
                📍
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Head office
              </h3>
              <p className="text-sm text-slate-600">
                House 44, Road 2/A, Dhanmondi <br />
                Dhaka 1209
              </p>
            </div>
            <div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-colors"
              >
                <span>Open in Maps ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
