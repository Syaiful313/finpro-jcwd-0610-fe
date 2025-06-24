import Image from "next/image";

const AboutPage = () => {
  return (
    <main className="max-w-5xl mx-auto py-36 px-6 sm:px-10 lg:px-12 font-inter">
        <h1 className="text-5xl font-extrabold mb-6 text-center text-primary">About Bubblify</h1>
        <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            What began as a final project quickly turned into Bubblify, our answer to the everyday student laundry problem, powered by tech and built for ease.
        </p>

        <h2 className="text-3xl font-bold mb-6 text-gray-900">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
            {
                name: "Syaiful",
                role: "Full-stack Developer",
                src: "https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750741122/syaiful.jpg",
                linkedin: "https://www.linkedin.com/in/muhammad-syaiful-mu-min-599a27283/",
                github: "https://github.com/Syaiful313",
            },
            {
                name: "Omi",
                role: "Full-stack Developer",
                src: "https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750492587/omi1_rprquf.jpg",
                linkedin: "https://www.linkedin.com/in/dharma-ayomi-ramadhani",
                github: "https://github.com/dharmaayomi",
            },
            {
                name: "Diah",
                role: "Full-stack Developer",
                src: "https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750492585/diah_pubId.jpg",
                linkedin: "https://www.linkedin.com/in/diarifiana/",
                github: "https://github.com/diarifiana",
            },
            ].map(({ name, role, src, linkedin, github }, i) => (
            <div className="text-center" key={i}>
                <Image src={src} alt={name} width={180} height={180} className="rounded-full mx-auto mb-3 shadow-md object-cover aspect-square" />
                <p className="text-lg font-medium text-gray-800">{name}</p>
                <p className="text-sm text-gray-500 mb-2">{role}</p>
                <div className="flex justify-center space-x-4 text-gray-500">
                {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.6 4.1 5.5 3 5.5S1.02 4.6 1.02 3.5 1.9 1.5 3 1.5s1.98.9 1.98 2zM.5 24h5V8H.5v16zM8.5 24h5v-8.4c0-4.6 6-5 6 0V24h5V13.5c0-8.3-9.5-8-11 0V8h-5v16z"/></svg>
                    </a>
                )}
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.8-1.5-3.8-1.5-.6-1.4-1.5-1.8-1.5-1.8-1.2-.9.1-.9.1-.9 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.5-1.4.8-1.7-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17 4.9 18 5.2 18 5.2c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.5-2.8 5.5-5.4 5.8.5.4.9 1.1.9 2.2v3.2c0 .3.2.7.8.6A10.5 10.5 0 0 0 23.5 12c0-6.4-5.1-11.5-11.5-11.5z"/></svg>
                    </a>
                )}
                </div>
            </div>
            ))}
        </div>

        <section className="pb-24 md:pt-15 px-6 sm:px-12">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">The Bubblify Journey</h2>

        <div className="relative border-l-4 border-primary/30 max-w-2xl mx-auto space-y-10 pl-6">
            {[
            ["20 January 2025", "Started our journey in Purwadhika Web Development bootcamp."],
            ["13 February 2025", "Faced our first coding challenge and dove into frontend development."],
            ["11 March 2025", "Built our first frontend portfolio site for the second code challenge."],
            ["9 April 2025", "Started our mini project, an event management platform."],
            ["19 May 2025", "Kicked off our final project: Bubblify!"],
            ["30 June 2025", "Final project submission and presentations wrapped. What a ride!"],
            ["Today", "Still building, still learning, and excited for what’s next 🚀"],
            ].map(([date, desc], i) => (
            <div key={i} className="relative">
                <div className="absolute -left-[30px] top-1.5 w-4 h-4 bg-primary border-4 border-white rounded-full shadow-md" />
                <div className="bg-white border border-gray-200 rounded-xl shadow p-5">
                <p className="text-primary font-semibold mb-1">{date}</p>
                <p className="text-gray-700">{desc}</p>
                </div>
            </div>
            ))}
        </div>
        </section>

        <h2 className="text-3xl font-bold mb-4 text-gray-900">Built Together, Learned Together</h2>
        <p className="text-gray-700 mb-10 leading-relaxed text-lg">
            Bubblify started as a group effort and now it will be helping people one laundry load at a time.
            It's more than just a laundry app, it's a symbol of our hustle, teamwork, and friendship.
            Special thanks to our lecturer, <span className="font-semibold">Daniel Reinhard</span>, 
            for the guidance, feedback, and support that helped shape Bubblify from day one.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            <Image src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750602144/d0a2834a-3628-4dc7-8f26-53c91992e47f_ksxdzd.jpg" alt="Class Photo" className="rounded-xl shadow-md w-full object-cover aspect-[4/3]" width={400} height={300} />
            <Image src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750602146/44ad1b6d-c6ed-4c48-aa8d-8ec99cd07fba_lybpmy.jpg" alt="Class Photo" className="rounded-xl shadow-md w-full object-cover aspect-[4/3]" width={400} height={300} />
            <Image src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1750602506/IMG_9809_lj1hkj.jpg" alt="Class Photo" className="rounded-xl shadow-md w-full object-cover aspect-[4/3] sm:col-span-2" width={800} height={400} />
        </div>

        <div className="text-center text-gray-500 text-base italic">
            "It’s not about having the perfect language, it’s about enabling people to build." — Brendan Eich
        </div>
    </main>
  );
}

export default AboutPage;