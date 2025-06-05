import HeroSection from "@/features/home/components/Hero"
import MainSection from "./components/MainSection"
import AdditionalSection from "./components/AdditionalSection"
import TestimonialsSection from "./components/TestimonialSection"
import DiscountBanner from "./components/DiscountBanner"

const Homepage = () => {
  return (
    <main className="max-w-screen-2xl mx-auto w-full">  
      <HeroSection/>
      <MainSection/>
      <AdditionalSection/>
      <TestimonialsSection/>
      <DiscountBanner/>
    </main>
  )
}

export default Homepage