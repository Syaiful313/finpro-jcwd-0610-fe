const AdditionalSection = () => {
  return (
    <div className="bg-white flex flex-col lg:flex-row px-12 py-20 font-sans">
        <div className="lg:w-1/2 justify-items-center mb-8 lg:mb-0 flex flex-col items-center">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-800"> Your premier <br /> laundry <br /> <span className="text-primary">experience.</span></h1>
        </div>
        <div className="lg:w-1/2 flex flex-col space-y-8">
            <div className="flex items-start">
                <div className="p-3 rounded-full bg-blue-100 mr-4 mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p className="text-lg text-gray-700"> Our drivers service operates between <span className="font-semibold">9:00 AM and 8:00 PM</span> to fit your daily schedule.</p>
            </div>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4 mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p className="text-lg text-gray-700">Each item is inspected, then expertly folded with precision.</p>
            </div>
            <div className="flex items-start">
                <div className="p-3 rounded-full bg-blue-100 mr-4 mt-1">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <p className="text-lg text-gray-700">A unique tracking notification will keep you informed of your driver location and your laundry process.</p>
            </div>
            <div className="flex items-start">
                <div className="p-3 rounded-full bg-blue-100 mr-4 mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p className="text-lg text-gray-700">Our specialists assess each item, applying the optimal cleaning methods to ensure vibrant colors, fresh scents, and pristine results.</p>
            </div>
        </div>
    </div>
  )
}

export default AdditionalSection