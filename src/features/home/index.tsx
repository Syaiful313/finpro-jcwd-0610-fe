import MainSection from "./components/MainSection"
import AdditionalSection from "./components/AdditionalSection"
import TestimonialsSection from "./components/TestimonialSection"
import DiscountBanner from "./components/DiscountBanner"
import HeroSection from "./components/HeroSection";
import { Fade } from "react-awesome-reveal";

const Homepage = () => {
  return (
    <main className="max-w-screen-2xl mx-auto w-full">  
      <Fade triggerOnce cascade damping={0.2}>
        <HeroSection />
        <MainSection />
        <AdditionalSection />
        <TestimonialsSection />
        <DiscountBanner />
      </Fade>
    </main>
  )
}

export default Homepage