import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white py-16 text-gray-700">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Company</h3>
                <ul>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">About</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">FAQs</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Privacy</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Terms</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Connect</h3>
                <ul>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Contact</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Instagram</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Facebook</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-gray-800 mb-4 text-lg">More</h3>
                <ul>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">How it works</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Guarantee</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Refer friends</Link></li>
                    <li className="mb-2"><Link href="#" className="hover:underline text-gray-700">Gift Cards</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Download our app</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    The <Link href="#" className="text-primary hover:underline">Bubblify mobile app</Link> is the most convenient way to enjoy all Bubblify services.
                </p>
                <div className="flex space-x-4">
                    <Link href="#" className="inline-block">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10"/>
                    </Link>
                    <Link href="#" className="inline-block">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10"/>
                    </Link>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;