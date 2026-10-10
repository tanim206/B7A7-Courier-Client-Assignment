import Link from "next/link";

import { Logo } from "@/utils/logo";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex">
              <Logo />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              Delivering to homes across Bangladesh since 2016. Fast, secure,
              and reliable logistics solutions.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-orange-500 hover:text-white"
              >
                <FaFacebookF className="size-4" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-orange-500 hover:text-white"
              >
                <FaLinkedin className="size-4" />
              </a>

              <a
                href="#"
                aria-label="Twitter / X"
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-orange-500 hover:text-white"
              >
                <FiTwitter className="size-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Services
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/track"
                  className="transition-colors hover:text-orange-500"
                >
                  Track a parcel
                </Link>
              </li>

              <li>
                <Link
                  href="/rates"
                  className="transition-colors hover:text-orange-500"
                >
                  Delivery rates
                </Link>
              </li>

              <li>
                <Link
                  href="/coverage"
                  className="transition-colors hover:text-orange-500"
                >
                  Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Business
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-orange-500"
                >
                  Merchant sign-up
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-orange-500"
                >
                  Merchant sign-in
                </Link>
              </li>

              <li>
                <Link
                  href="/moderator"
                  className="transition-colors hover:text-orange-500"
                >
                  Moderator sign-in
                </Link>
              </li>

              <li>
                <Link
                  href="/business"
                  className="transition-colors hover:text-orange-500"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Company
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-orange-500"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-orange-500"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-orange-500"
                >
                  Terms and conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-orange-500"
                >
                  শর্তাবলী (বাংলা)
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-orange-500"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Office */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Office
            </h4>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />

                <p>
                  House 44, Road 2/A,
                  <br />
                  Dhanmondi, Dhaka 1209
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-orange-500" />

                <a
                  href="mailto:info@swiftconnect.com.bd"
                  className="transition-colors hover:text-orange-500"
                >
                  info@swiftconnect.com.bd
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-orange-500" />

                <a
                  href="tel:09678045045"
                  className="font-semibold text-slate-800 transition-colors hover:text-orange-500"
                >
                  09678-045045
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-slate-100 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} SWIFTCONNECT Courier Ltd. All
            rights reserved.
          </p>

          <p>Fast. Secure. Reliable.</p>
        </div>
      </div>
    </footer>
  );
}
