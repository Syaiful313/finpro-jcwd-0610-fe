const GuaranteeSection = () => {
  return (
    <section className="bg-white pb-16 md:py-24 px-6 sm:px-12 text-start md:text-center">
        <div className="max-w-4xl mx-auto py-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-8">
            Your Satisfaction, Guaranteed
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 mb-10 leading-relaxed">
            We stand by the quality of our service. If you're not 100% happy with how your laundry is cleaned or returned,
            we’ll re-clean it, free of charge.
            </p>
            <div className="inline-flex items-center bg-white border-2 border-primary rounded-full px-7 py-4 shadow-md hover:shadow-xl transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-primary text-center font-semibold text-lg sm:text-xl">Bubblify Clean Guarantee</span>
            </div>
        </div>
    </section>
  )
}

export default GuaranteeSection