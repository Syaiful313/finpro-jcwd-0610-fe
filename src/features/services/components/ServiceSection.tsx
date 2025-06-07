import Image from 'next/image'

const ServiceSection = () => {
  return (
    <section className="min-h-screen bg-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl w-full bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center mt-15">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight transform transition-transform duration-300 hover:scale-105">
                    Wash & Iron
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl mb-6 leading-relaxed">
                    Say goodbye to laundry day stress with our Wash & Iron service, designed to save you time, energy, and peace of mind.
                </p>
                <p className="text-gray-600 text-lg sm:text-xl mb-6 leading-relaxed">
                    Bubblify will pick up your laundry, clean it exactly to your preferences using a dedicated machine, and deliver it back to your door neatly folded, yes, even your socks are paired.
                </p>
                <p className="text-gray-600 text-lg sm:text-xl mb-8 leading-relaxed">
                    Let Bubblify handle the laundry, so you can focus on what truly matters.
                </p>
                <div className="flex flex-col sm:flex-row items-center bg-gray-100 rounded-xl p-4 mb-6 shadow-inner">
                    <div className="flex-1 flex flex-col mr-0 sm:mr-4 mb-4 sm:mb-0">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Pickup</span>
                        <span className="text-gray-800 text-lg font-medium">Tonight</span>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Where</span>
                        <input
                            type="text"
                            placeholder="Add address"
                            className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg font-medium py-1"
                        />
                    </div>
                    <button className="ml-0 sm:ml-4 mt-4 sm:mt-0 bg-primary hover:bg-pink-400 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg text-center text-base sm:text-lg font-medium shadow-md">
                    Your 20% off in credits will be automatically applied
                </div>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
                <div className="rounded-lg max-w-full h-auto object-cover">
                    <Image
                    src="/laundry-basket.webp"
                    alt="Laundry Basket"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl object-cover w-full h-auto"
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default ServiceSection