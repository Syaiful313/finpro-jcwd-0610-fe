const DiscountBanner = () => {
  return (
    <div className="bg-[#76DAFF] my-20 py-20 md:py-30 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-10 left-0 w-full h-[150px] bg-gradient-to-r from-blue-400/30 to-blue-500/30 rotate-3 transform origin-top-left -translate-x-1/4"></div>
            <div className="absolute -top-20 right-0 w-full h-[180px] bg-gradient-to-l from-blue-400/20 to-blue-500/20 -rotate-6 transform origin-top-right translate-x-1/4"></div>
        </div>
        <div className="relative z-10"> 
            <p className="text-gray-800 uppercase tracking-widest text-sm md:text-base mb-2">SCHEDULE TODAY TO</p>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4">Get 20% off</h2>
            <p className="text-primary text-3xl md:text-5xl font-extrabold mb-8">your first order</p>
            <button className="bg-primary hover:bg-secondary text-white hover:text-primary font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out">Schedule your first pickup</button>
        </div>
    </div>
  );
};

export default DiscountBanner;