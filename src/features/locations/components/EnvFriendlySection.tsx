const EnvFriendlySection = () => {
  return (
    <section className="bg-white py-24 px-6 sm:px-12 text-green font-sans">
        <div className="max-w-6xl mx-auto text-start md:text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            We Care for Your Clothes and the Planet
            </h2>
            <p className="text-xl sm:text-2xl text-black mb-16 max-w-3xl mx-auto leading-relaxed">
            Our commitment goes beyond laundry. We use less water, safe materials, and smart logistics. All to keep things clean, for you and the environment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            {[
                {
                title: 'Water Efficiency',
                desc: 'Each load is optimized to save up to 40% water compared to home washers.',
                icon: (
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.105 0-2-.895-2-2V4h4v2c0 1.105-.895 2-2 2zM4 8h16v12H4z" />
                    </svg>
                ),
                },
                {
                title: 'Non-Toxic Products',
                desc: 'Biodegradable, hypoallergenic detergents that are gentle on clothes and skin.',
                icon: (
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c4.477 0 10 4 10 10 0-6 5.523-10 10-10 0-5.523-4.477-10-10-10z" />
                    </svg>
                ),
                },
                {
                title: 'Eco-Friendly Delivery',
                desc: 'We use electric and low-emission vehicles to reduce our carbon footprint.',
                icon: (
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7 9 4 12 4 15a8 8 0 0016 0c0-3-3-6-8-12z" />
                    </svg>
                ),
                },
                {
                title: 'Recycled Packaging',
                desc: 'Our packaging is reused and recycled to minimize waste and plastic usage.',
                icon: (
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ),
                },
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-start">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-base text-black leading-relaxed">{item.desc}</p>
                </div>
            ))}
            </div>
        </div>
    </section>
  )
}

export default EnvFriendlySection