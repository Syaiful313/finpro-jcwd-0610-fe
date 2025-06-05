'use client'
import { useState } from "react";
import { AccordionItem } from "./Accordion";

const FaqSection = () => {
  const [openItem, setOpenItem] = useState(null);
  const handleItemClick = (index: any) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <h1 className="text-5xl font-extrabold mb-12 text-primary">Frequently Asked Questions</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-3xl">
        <h2 className="text-4xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          Based somewhere else?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed">We are expanding quickly to serve more neighborhoods! If we are not in your location, you can still schedule pickups in nearby areas or check back soon as we grow.</p>
        <div className="space-y-4"> 
          <AccordionItem
            title="How does your laundry pickup and delivery work?"
            isOpen={openItem === 0}
            onClick={() => handleItemClick(0)}
          >
            <p> Schedule a pickup time online or via our app. Our courier collects your laundry, it gets professionally cleaned, and then delivered back to your doorstep, fresh and folded.</p>
          </AccordionItem>
          <AccordionItem
            title="Which locations do you currently serve?"
            isOpen={openItem === 1}
            onClick={() => handleItemClick(1)}
          >
            <p>We provide laundry pickup and delivery across several neighborhoods including Sleman, Bantul, Malioboro, Kotagede, Seturan, and Gamping. Check our website for the latest coverage map.</p>
          </AccordionItem>
          <AccordionItem
            title="Can I schedule a pickup if I live outside your service areas?"
            isOpen={openItem === 2}
            onClick={() => handleItemClick(2)}
          >
            <p>At the moment, pickups are only available in our listed service areas. We are actively working on expanding to more locations, so stay tuned!</p>
          </AccordionItem>
          <AccordionItem
            title="What types of laundry do you accept?"
            isOpen={openItem === 3}
            onClick={() => handleItemClick(3)}
          >
            <p> We handle clothing, linens, bedding, and delicate fabrics. Please check our website for a full list of accepted items and special care instructions.</p>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}

export default FaqSection