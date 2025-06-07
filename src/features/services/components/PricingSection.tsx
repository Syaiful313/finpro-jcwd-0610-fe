const PricingSection = () => {
  return (
    <section id="pricing" className="min-h-screen bg-white font-inter flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col justify-center text-center lg:text-left mb-8 lg:mb-0">
                <h1 className="text-5xl sm:text-5xl font-bold text-primary leading-tight mb-4">
                    Bubblify Laundry Options
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Select <span className="font-bold text-primary">Garment Care </span>for per-piece precision, or choose <span className="font-bold text-primary">Laundry by Weight</span> for a convenient, cost-effective solution to everyday essentials. Every option comes with the same elevated standard of care.
                </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-gray-200">
                    <div className="flex flex-col gap-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Garment Care</h2>
                        <p className="text-gray-600 mb-4">Perfect for occasional use, pay only for what you need, when you need it.</p>
                        <p className="text-gray-900 text-sm font-semibold mb-2">Starting from</p>
                        <p className="text-5xl font-bold text-gray-900 mb-6">Rp5,000 <span className="text-sm">/ item</span></p>
                        <ul className="space-y-3 text-gray-700 text-base">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Free Pickup & Delivery in Jogja *
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                15% Off for Loyal Customers
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Priority Service & Exclusive Discounts
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Household items priced separately
                            </li>
                        </ul>
                    </div>
                    <button className="mt-8 w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 hover:cursor-pointer">
                        Schedule a pickup
                    </button>
                </div>
                <div className="bg-gradient-to-br from-blue-700 to-primary text-white rounded-xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#FFBDE6] text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Most popular
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Laundry by Weight</h2>
                        <p className="text-blue-200 mb-4">A flexible, all-inclusive solution for your routine laundry needs, priced by the kilo, not by the hassle.</p>
                        <p className="text-blue-100 text-sm font-semibold mb-2">Starting from</p>
                        <p className="text-5xl font-bold mb-6">Rp15,000 / kg </p>
                        <ul className="space-y-3 text-blue-100 text-base">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-[#FFBDE6] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Free Pickup & Delivery *
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-[#FFBDE6] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Free Next-Day Delivery *
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-[#FFBDE6] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                No Service Fee
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-[#FFBDE6] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Get bonus kilos every month
                            </li>
                        </ul>
                    </div>
                    <div className="mt-8 space-y-4">
                        <button className="w-full bg-[#FFBDE6] text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-secondary hover:cursor-pointer transition duration-300">
                            Try Laundry by Weight
                        </button>
                        <button className="w-full text-blue-100 py-3 px-6 rounded-lg font-semibold hover:text-white transition duration-300">
                            Sign up to learn about our services
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default PricingSection