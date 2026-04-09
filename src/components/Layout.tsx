import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
