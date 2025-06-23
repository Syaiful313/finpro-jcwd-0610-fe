const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dewi',
      text: "Bubblify is my go-to laundry service, no matter where I live. Their convenience, amazing-smelling detergent, and friendly delivery team make me absolutely obsessed. Highly recommended!",
      bgColor: 'bg-primary',
      profileImg: 'https://res.cloudinary.com/dd6hqmwqu/image/upload/v1748006354/samples/bike.jpg', 
    },
    {
      id: 2,
      name: 'Arif',
      text: "Beyond convenient and always a delight! I'm obsessed with Bubblify, especially their fantastic-smelling detergent and incredibly friendly delivery staff. I've used them in every city and highly recommend!",
      bgColor: 'bg-[#F473B9]', 
      profileImg: 'https://res.cloudinary.com/dd6hqmwqu/image/upload/v1748006353/samples/people/kitchen-bar.jpg', 
    },
    {
      id: 3,
      name: 'Indah',
      text: "Obsessed with Bubblify! Their service is incredibly convenient, the detergent smells amazing, and every delivery person has been a pleasure. My top laundry choice, city after city.",
      bgColor: 'bg-[#FFBDE6]', 
      profileImg: 'https://res.cloudinary.com/dd6hqmwqu/image/upload/v1748006355/samples/people/bicycle.jpg', 
    },
    {
      id: 4,
      name: 'Rizky',
      text: "Bubblify has me hooked! Despite having laundry facilities available, I prefer their incredibly easy and great service. It makes me question why others still bother with their own laundry.",
      bgColor: 'bg-[#76DAFF]', 
      profileImg: 'https://res.cloudinary.com/dd6hqmwqu/image/upload/v1748006355/samples/people/smiling-man.jpg', 
    },
  ];

  return (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What our customers have to say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className={`rounded-lg shadow-lg p-6 flex flex-col justify-between min-h-[300px] ${testimonial.bgColor}`}>
                        <div className="mb-4">
                            <p className="text-white text-lg leading-relaxed">"{testimonial.text}"</p>
                        </div>
                        <div className="flex items-center mt-auto">
                            <img src={testimonial.profileImg} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"/>
                            <p className="font-semibold text-white">{testimonial.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default TestimonialsSection;