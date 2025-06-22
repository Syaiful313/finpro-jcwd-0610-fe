import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">About Bubblify</h1>
        <p className="text-base text-gray-700 mb-8 text-center">
            What began as a final project quickly turned into Bubblify, our answer to the everyday student laundry problem, powered by tech and built for ease.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
            <Image src="/team/member1.jpg" alt="Syaiful" width={200} height={200} className="rounded-full mx-auto mb-2" />
            <p className="font-medium">Syaiful</p>
            <p className="text-sm text-gray-500">Full-stack Developer</p>
            </div>
            <div className="text-center">
            <Image
                src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750492587/omi1_rprquf.jpg"
                alt="Omi"
                width={200}
                height={200}
                className="rounded-full mx-auto mb-2 object-cover aspect-square"
            />
            <p className="font-medium">Omi</p>
            <p className="text-sm text-gray-500">Full-stack Developer</p>
            </div>
            <div className="text-center">
            <Image src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750492585/diah_pubId.jpg" alt="Diah" width={200} height={200} className="rounded-full mx-auto mb-2" />
            <p className="font-medium">Diah</p>
            <p className="text-sm text-gray-500">Full-stack Developer</p>
            </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Journey</h2>
        <ol className="relative border-l border-gray-200 dark:border-gray-700 mb-12">
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">20 January 2025</h3>
                <p className="text-gray-600">Started our journey in Purwadhika Web Development bootcamp.</p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">13 February 2025</h3>
                <p className="text-gray-600">Faced our first coding challenge and dove into frontend development.</p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">11 March 2025</h3>
                <p className="text-gray-600">Built our first frontend portfolio site for the second code challenge.</p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">9 April 2025</h3>
                <p className="text-gray-600">Started our mini project, an event management platform.</p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">19 May 2025</h3>
                <p className="text-gray-600">Kicked off our final project: Bubblify!</p>
            </li>
            <li className="mb-10 ml-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">30 June 2025</h3>
                <p className="text-gray-600">Final project submission and presentations wrapped. What a ride!</p>
            </li>
            <li className="ml-6">
                <span className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5 top-1.5"></span>
                <h3 className="text-lg font-semibold text-gray-900">Today</h3>
                <p className="text-gray-600">Still building, still learning, and excited for what’s next 🚀</p>
            </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Built Together, Learned Together</h2>
        <p className="text-gray-600 mb-4">
            Bubblify started as a group effort and now it will be helping people one laundry load at a time. It is more than just a laundry app, a symbol of our hustle, teamwork, and friendship. Also, special thanks to our lecturer, <span className="font-semibold">Daniel Reinhard</span>, 
            for the guidance, feedback, and support that helped shape Bubblify from day one.
        </p>
        <div className="mb-12">
            <Image src="/team/class-photo.jpg" alt="Class Photo" width={800} height={400} className="rounded-lg mx-auto" />
        </div>
        <div className="text-center text-gray-600 text-sm italic mt-8">
        "It’s not about having the perfect language; it’s about enabling people to build." — Brendan Eich
        </div>
    </div>

  );
}

export default AboutPage;