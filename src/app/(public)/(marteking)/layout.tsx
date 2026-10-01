
import { Footer } from "@/components/shared/Footer";
import Navber from "@/components/shared/Navber";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navber />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
