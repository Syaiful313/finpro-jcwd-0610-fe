import { Search, PaintBucket, SoapDispenserDroplet, Package } from 'lucide-react'; 

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
            description: ' Your laundry is sorted by color and washed using cold water to protect fabrics and save energy.',
        },
        {
            icon: SoapDispenserDroplet, 
            title: 'Personalized cleaning options',
            description: 'Whether you prefer fragrance-free detergent, extra softening, or special care, just tell us your preferences, we have got you covered.',
        },
        {
            icon: Package, 
            title: 'Perfectly ironed and delivered',
            description: ' We ironed your clothes neatly, match your socks, and bring everything back to your doorstep, fresh, organized, and ready to go.',
        },
    ];

    return (
        <section className="min-h-screen bg-gradient-to-r from-primary to-pink-400 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-muted mb-12 text-center transition-colors duration-500">
                How do we prepare your clothes for cleaning?
                </h2>
                <div className="grid grid-cols-1 gap-8">
                    {steps.map((step, index) => (
                        <div key={index}
                            className="bg-secondary p-8 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <div className="mb-6">
                                <step.icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-4">
                                {step.title}
                            </h3>
                            <p className="text-primary leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StepsSection