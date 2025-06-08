import { FC } from "react"

interface LocationCardProps {
    location: string, 
    imageUrl: string,
}
const LocationCard: FC<LocationCardProps> = ({ location, imageUrl }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
        <img
            src={imageUrl}
            alt={`Location in ${location}`}
            className="w-full h-64 object-cover rounded-t-xl"
        />
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">{location}</h2>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>  
    )
}

export default LocationCard