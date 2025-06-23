'use client'
import CTASection from "./components/CTASection";
import EnvFriendlySection from "./components/EnvFriendlySection";
import FaqSection from "./components/FaqSection";
import GuaranteeSection from "./components/GuaranteeSection";
import LocationSection from "./components/LocationSection";

const LocationPage = () => {
  return (
    <main>
      <section className="min-h-screen bg-white font-sans text-gray-800 flex flex-col items-center md:pt-12 px-4 sm:px-6 lg:px-8">
        <LocationSection/>
        <EnvFriendlySection/>
        <GuaranteeSection/>
        <FaqSection/>
      </section>
      <CTASection/>
    </main>
  );
}

export default LocationPage