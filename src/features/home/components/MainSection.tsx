import Link from "next/link"

const MainSection = () => {
  return (
    <section className="min-h-screen bg-gray-100 flex flex-col font-inter">
        <div className="bg-white py-16 px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                <div className="md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <img src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749783555/bags_wmbbk1.svg" alt="Bag Icon" className="mb-4 w-20 h-20" />                    
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Effortless Everyday Laundry</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md">Experience the simplest way to manage your daily laundry needs.</p>
                    <div className="flex items-start gap-4 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Schedule a pickup</h3>
                            <p className="text-gray-600">Set up a pickup any day of the week. Our dedicated drivers will arrive between 9 AM and 8 PM, equipped with your complimentary and ready to collect your clothes.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.242 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gentle & Specialized Cleaning</h3>
                            <p className="text-gray-600"> Our process includes carefully separating your lights and darks, followed by a cold water wash. For those with sensitivities, hypoallergenic detergent and fabric softener are readily available upon request, at no additional cost.</p>
                        </div>
                    </div>
                    <Link href='/order/request'>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md hover:cursor-pointer">
                        Get 20% off
                    </button>
                    </Link>
                </div>
                <div className="md:flex-1 flex justify-center md:justify-end items-center">
                    <img
                        src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749784151/delivery_aszggk.webp"
                        alt="Laundry Service"
                        className="rounded-lg shadow-lg max-w-full h-auto"
                    />
                </div>
            </div>
        </div>
        <div className="bg-white py-16 px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="md:flex-1 flex justify-center md:justify-start">
                    <img
                        src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749784341/laundry-fold_cz7pug.webp"
                        alt="Laundry Service"
                        className="rounded-lg shadow-lg max-w-full h-auto"
                    />
                </div>
                <div className="md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <img src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749783832/clothes_fli33i.svg" alt="Clothes Icon" className="mb-4 w-20 h-20" />                    
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Premium Care</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md">Experience premium garment care that saves you time, ensuring you always look your sharpest.</p>
                    <div className="flex items-start gap-4 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Item Visibility</h3>
                            <p className="text-gray-600">Schedule your pick-up whenever it suits you. We'll send you a detailed notification and inventory of every item we're cleaning, so you're always in the loop.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.17 8.93-4.902 10.93m-10.902-2.03l-1.809-1.982" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Stain Mastery</h3>
                            <p className="text-gray-600">Our experts strictly adhere to care label guidelines, meticulously inspecting your clothes for stains to deliver the best possible treatment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)}

export default MainSection