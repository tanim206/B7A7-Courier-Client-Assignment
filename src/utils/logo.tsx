export function Logo() {
  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-white">
      {/* Logo Image (Choto size) */}
      <img
        src="/assets/logo.png"
        alt="SwiftConnect Courier & Logistics Logo"
        className="w-10 h-10 object-contain"
      />

      {/* Brand Info */}
      <div className="flex flex-col">
        <h2 className="text-base font-bold tracking-wider text-slate-800 leading-tight">
          SWIFT<span className="text-orange-500">CONNECT</span>
        </h2>
        <span className="text-[10px] font-medium text-slate-500 tracking-wider">
          COURIER & LOGISTICS
        </span>
      </div>
    </div>
  );
}
