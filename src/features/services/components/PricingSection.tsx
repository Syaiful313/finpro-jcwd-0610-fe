'use client'
import { useRouter } from "next/navigation"

const PricingSection = () => {
    const router = useRouter();
  return (
    <section id="pricing" className="min-h-screen bg-white flex items-center justify-center px-4 md:px-12 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 flex flex-col justify-center text-left">
                <h2 className="text-5xl font-extrabold text-primary leading-tight mb-6">
                    Premium Laundry Plans
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Choose <span className="text-primary font-semibold">Garment Care</span> for premium individual treatment, or go for <span className="text-primary font-semibold">Laundry by Weight</span> for maximum value on daily wear.
                </p>
                <div className="w-24 h-1 bg-primary rounded-full mt-4"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 flex flex-col justify-between transition hover:shadow-xl duration-300">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Garment Care</h3>
                        <p className="text-gray-600 mb-4">Only pay for what you need, when you need it.</p>
                        <p className="text-sm font-semibold text-gray-500">Starting from</p>
                        <p className="text-4xl font-bold text-primary mb-6">Rp5,000 <span className="text-base font-normal">/ item</span></p>
                        <ul className="space-y-3 text-gray-700">
                            {[
                            'Free Pickup & Delivery in Jogja *',
                            '15% Off for Loyal Customers',
                            'Priority Service & Exclusive Discounts',
                            'Household items priced separately'
                            ].map((item, i) => (
                            <li key={i} className="flex items-center">
                                <span className="text-primary mr-3">✔</span> {item}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <button className="mt-8 w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
                    onClick={() => {router.push('/order/request')}}>
                        Schedule Pickup
                    </button>
                </div>
                <div className="bg-gradient-to-tr from-blue-800 to-primary text-white rounded-2xl shadow-md p-8 flex flex-col justify-between relative overflow-hidden transition hover:shadow-2xl duration-300">
                    <span className="absolute top-4 right-4 bg-pink-200 text-primary text-xs font-bold px-3 py-1 rounded-full shadow">
                    Most Popular
                    </span>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Laundry by Weight</h3>
                        <p className="text-blue-100 mb-4">All-in-one service charged by the kilo. Simple and smart.</p>
                        <p className="text-sm font-semibold text-blue-200">Starting from</p>
                        <p className="text-4xl font-bold mb-6">Rp15,000 <span className="text-base font-normal">/ kg</span></p>
                        <ul className="space-y-3 text-blue-100">
                            {[
                            'Free Pickup & Delivery *',
                            'Free Next-Day Delivery *',
                            'No Service Fee',
                            'Bonus Kilos Monthly'
                            ].map((item, i) => (
                            <li key={i} className="flex items-center">
                                <svg className="w-5 h-5 text-white mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg> {item}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-8 space-y-4">
                        <button className="w-full bg-white text-primary py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                            onClick={() => {router.push('/order/request')}}>
                            Try Laundry by Weight
                        </button>
                        <button className="w-full text-blue-100 hover:text-white py-3 px-6 rounded-lg font-medium transition duration-300 underline"
                            onClick={() => {router.push('/about')}}>
                            Learn more about our services
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default PricingSection