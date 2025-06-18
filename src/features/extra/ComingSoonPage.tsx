'use client'
import { useRouter } from "next/navigation";

const ComingSoonPage = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-4 animate-bounce">
                Coming Soon
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
                We’re working hard to bring something amazing. Stay tuned and we’ll be launching shortly!
            </p>
            <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition"
                onClick={() => {router.push("/register")}}>
                Notify Me
                </button>
                <button className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-full hover:bg-blue-50 transition"
                onClick={() => {router.push("/about")}}>
                Learn More
                </button>
            </div>
            <div className="mt-10 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Bubblify. All rights reserved.
            </div>
        </div>
    );
};

export default ComingSoonPage;
