'use client'
import { useRouter } from 'next/navigation'

const CTASection = () => {
    const router = useRouter();

    return (
        <section className="relative bg-gradient-to-br from-white via-slate-50 to-gray-100 py-36 px-6 sm:px-12 text-center overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary mb-6">
                Ready for Fresh Laundry?
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
                Get your laundry picked up today!  Fast, affordable, and always with premium care.
                </p>
                <button
                onClick={() => router.push('/order/request')}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-lg sm:text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                Schedule a Pickup
                </button>
            </div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl opacity-30"></div>
        </section>

    )
}

export default CTASection