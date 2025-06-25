'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const HeroSection = () => {
  const [address, setAddress] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  const handlePickup = () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (address.trim() !== '') {
      router.push(`/order/request`)
    } else {
      alert('Please enter your address first.')
    }
  }

  return (
    <section className="relative h-[300px] md:h-screen w-full overflow-hidden">
      <video autoPlay muted loop playsInline className="h-full w-full object-cover">
        <source src="https://res.cloudinary.com/dd6hqmwqu/video/upload/8756709-uhd_4096_2160_25fps_jiftsm.mp4?_s=vp-2.5.0" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-start text-md md:text-2xl text-muted px-8 py-20 md:p-40 gap-y-4">
        <p>
          <span className="text-[20px] md:text-[80px] font-bold">
            We pick up, wash,<br />and deliver
          </span><br />
          Fresh clothes without the hassle!
        </p>
        <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-auto">
            <span className="px-4 text-gray-800 font-semibold border-r border-gray-200 h-12 flex items-center flex-shrink-0">
              Pickup Now
            </span>
            <input
              type="text"
              placeholder="Add your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-grow px-3 text-gray-800 focus:outline-none h-12"
            />
            <button
              onClick={handlePickup}
              className="hidden bg-orange-500 text-white px-3 rounded-r-lg hover:bg-orange-600 transition-colors h-12 md:flex items-center justify-center flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-5 md:h-20 w-auto max-w-[150px] object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-5 md:h-20 w-auto max-w-[150px] object-contain" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-yellow-400">5,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection