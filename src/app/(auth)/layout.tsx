import { Navbar } from "@/components/Navbar";

const homeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  );
};
export default homeLayout;
