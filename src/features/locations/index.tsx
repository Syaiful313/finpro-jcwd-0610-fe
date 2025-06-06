import FaqSection from "./components/FaqSection";
import LocationCard from "./components/LocationCard";

const LocationPage = () => {
    const locations = [
      {
        location: "Sleman",
        address: "Jl. Kaliurang No.55, Sleman, Yogyakarta",
        image: "/loc01.webp"
      },
      {
        location: "Bantul",
        address: "Jl. Parangtritis No.101, Bantul, Yogyakarta",
        image: "/loc02.webp"
      },
      {
        location: "Jalan Malioboro",
        address: "Jl. Malioboro No.18, Gondomanan, Yogyakarta",
        image: "/loc03.webp"
      },
      {
        location: "Kotagede",
        address: "Jl. Tegal Gendu No.3, Kotagede, Yogyakarta",
        image: "/loc04.webp"
      },
      {
        location: "Seturan",
        address: "Jl. Selokan Mataram No.23, Seturan, Depok, Sleman",
        image: "/loc05.webp"
      },
      {
        location: "Gamping",
        address: "Jl. Wates No.45, Gamping, Sleman, Yogyakarta",
        image: "/loc06.webp"
      }
    ]
    return (
      <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <header className="max-w-4xl mx-auto text-center mb-12 mt-28">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Explore Our Service Areas
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
             Bubblify brings fresh laundry to your door. Every neighborhood we serve is part of our mission to make laundry day effortless, reliable, and refreshingly simple.
          </p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mt-10 mb-10">
          {locations.map((location, index) => (
            <LocationCard
            location={location.location}
            imageUrl={location.image}
            key={index}
            />
          ))}
        </main>
        <FaqSection/>
    </div>
  );
}

export default LocationPage