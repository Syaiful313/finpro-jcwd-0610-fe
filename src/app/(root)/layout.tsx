import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const rootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
export default rootLayout;