import HeroSection from "@/features/home/_components/Hero"
import MainSection from "./_components/MainSection"
import AdditionalSection from "./_components/AdditionalSection"
import TestimonialsSection from "./_components/TestimonialSection"
import DiscountBanner from "./_components/DiscountBanner"

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