import { Search, PaintBucket, SoapDispenserDroplet, Package, CalendarDays, ThumbsUp } from 'lucide-react'; 

const StepsSection = () => {
    const steps = [
        {
            icon: Search,
            title: 'Thorough check before cleaning',
            description: 'We give your clothes a careful once-over, making sure pockets are empty and garments are ready for the wash.',
        },
        {
            icon: PaintBucket,
            title: 'Gentle, color-safe washing',
            description: 'Your laundry is sorted by color and washed using cold water to protect fabrics and save energy.',
        },
        {
            icon: SoapDispenserDroplet,
            title: 'Personalized cleaning options',
            description: 'Whether you prefer fragrance-free detergent, extra softening, or special care, just tell us your preferences, we have got you covered.',
        },
        {
            icon: Package,
            title: 'Perfectly ironed and delivered',
            description: 'We iron your clothes neatly, match your socks, and bring everything back to your doorstep, fresh, organized, and ready to go.',
        },
        {
            icon: CalendarDays,
            title: 'Flexible scheduling',
            description: 'Choose pickup and drop-off times that work around your schedule — morning, evening, or even same-day turnaround.',
        },
        {
            icon: ThumbsUp,
            title: 'Quality check guaranteed',
            description: 'Each order goes through final inspection to ensure everything meets our high standards before it reaches your hands.',
        },
    ];

    return (
      <section className="bg-white flex items-center justify-center px-6 pb-24 lg:p-12 font-sans">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12 text-center">
            How do we prepare your clothes for cleaning?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white hover:bg-primary/10 p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md flex flex-col items-center text-center"
              >
                <div className="mb-4 bg-primary/10 text-primary p-4 rounded-full">
                  <step.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}

export default StepsSection