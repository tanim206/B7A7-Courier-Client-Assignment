import Link from "next/link";
import { Logo } from "@/utils/logo"; // Apnar logo component path onujayi adjust kore neben

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Column 1: Brand Info & App Downloads */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Delivering to homes across Bangladesh since 2016. Fast, secure, and reliable logistics solutions.
            </p>
            
          

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition-colors">
                f
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition-colors">
                in
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition-colors">
                x
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/track" className="hover:text-orange-500 transition-colors">Track a parcel</Link></li>
              <li><Link href="/rates" className="hover:text-orange-500 transition-colors">Delivery rates</Link></li>
              <li><Link href="/coverage" className="hover:text-orange-500 transition-colors">Coverage</Link></li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Business</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/register" className="hover:text-orange-500 transition-colors">Merchant sign-up</Link></li>
              <li><Link href="/login" className="hover:text-orange-500 transition-colors">Merchant sign-in</Link></li>
              <li><Link href="/moderator" className="hover:text-orange-500 transition-colors">Moderator sign-in</Link></li>
              <li><Link href="/business" className="hover:text-orange-500 transition-colors">Business</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/about" className="hover:text-orange-500 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms and conditions</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">শর্তাবলী (বাংলা)</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Office Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Office</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="font-medium text-slate-700">House 44, Road 2/A, Dhanmondi</p>
              <p>Dhaka 1209</p>
              <p className="pt-2">Email: <a href="mailto:info@swiftconnect.com.bd" className="text-orange-500 hover:underline">info@swiftconnect.com.bd</a></p>
              <p>Hotline: <span className="font-bold text-slate-800">09678-045045</span></p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} SWIFTCONNECT Courier Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with Tailwind CSS & Orange Theme</p>
        </div>

      </div>
    </footer>
  );
}