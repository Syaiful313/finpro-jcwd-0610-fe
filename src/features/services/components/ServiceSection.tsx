'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const ServiceSection = () => {
    const router = useRouter();

  return (
    <section className="bg-white flex items-center justify-center px-6 pt-24 pb-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden">
            <div className="px-8 py-12 lg:py-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
                    Wash & Iron Service
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                    Say goodbye to laundry day stress with our Wash & Iron service, designed to save you time, energy, and peace of mind.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    We pick up your laundry, clean it exactly to your preferences with dedicated machines, and deliver it back folded to perfection, yes, even your socks are paired.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                    Let Bubblify handle the laundry so you can focus on what truly matters.
                </p>
            <div className="flex items-center bg-gray-50 border rounded-2xl p-5 gap-4 shadow-sm mb-6 justify-between">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Pickup</span>
                    <span className="text-gray-800 font-semibold text-lg">Tonight</span>
                </div>
                <button
                className="bg-primary text-white p-3 rounded-full transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                onClick={() => router.push("/order/request")}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </button>
            </div>
            <div className="bg-green-100 text-green-800 px-5 py-3 rounded-lg text-sm font-medium text-center shadow-inner">
                🎉 20% off will be automatically applied at checkout!
            </div>
            </div>
            <div className="h-full w-full relative">
                <Image
                    src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749784231/laundry-basket_zpkkzo.jpg"
                    alt="Laundry Basket"
                    fill
                    className="object-cover rounded-3xl w-full h-full"
                />
            </div>
        </div>
    </section>
  )
}

export default ServiceSection