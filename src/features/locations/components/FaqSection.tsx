'use client'
import { useState } from "react";
import { AccordionItem } from "./Accordion";

const FaqSection = () => {
  const [openItem, setOpenItem] = useState(null);
  const handleItemClick = (index: any) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-10">
    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-800 mb-12 text-center">
      Frequently Asked Questions
    </h1>
    <div className="w-full max-w-6xl bg-white p-6 sm:p-10 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-700 tracking-wide uppercase">
            Based somewhere else?
          </h2>
        </div>
        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          We are expanding quickly to serve more neighborhoods! If we’re not in your location yet,
          you can still schedule pickups in nearby areas—or check back soon as we grow.
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        <AccordionItem
          title="How does your laundry pickup and delivery work?"
          isOpen={openItem === 0}
          onClick={() => handleItemClick(0)}
        >
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Schedule a pickup time online or via our app. Our courier collects your laundry, it gets
            professionally cleaned, and then delivered back to your doorstep, fresh and folded.
          </p>
        </AccordionItem>
        <AccordionItem
          title="Which locations do you currently serve?"
          isOpen={openItem === 1}
          onClick={() => handleItemClick(1)}
        >
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            We provide laundry pickup and delivery across several neighborhoods including Sleman,
            Bantul, Malioboro, Kotagede, Seturan, and Gamping. Check our website for the latest
            coverage map.
          </p>
        </AccordionItem>
        <AccordionItem
          title="Can I schedule a pickup if I live outside your service areas?"
          isOpen={openItem === 2}
          onClick={() => handleItemClick(2)}
        >
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            At the moment, pickups are only available in our listed service areas. We’re actively
            expanding to more locations, so stay tuned!
          </p>
        </AccordionItem>
        <AccordionItem
          title="What types of laundry do you accept?"
          isOpen={openItem === 3}
          onClick={() => handleItemClick(3)}
        >
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            We handle clothing, linens, bedding, and delicate fabrics. Please check our website for a
            full list of accepted items and special care instructions.
          </p>
        </AccordionItem>
      </div>
    </div>
  </div>
  );
}

export default FaqSection