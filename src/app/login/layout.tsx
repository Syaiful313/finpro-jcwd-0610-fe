import Footer from "@/components/home/Footer";
import NavbarLogin from "@/features/login/_components/NavbarLogin";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavbarLogin />
      {children}
      <Footer />
    </div>
  );
};
export default LoginLayout;
