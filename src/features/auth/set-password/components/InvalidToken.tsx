import Link from "next/link"
import NavbarLogin from "../../login/_components/NavbarLogin"

const InvalidToken = () => {
  return (
    <>
    <NavbarLogin />
    <div className="flex items-center justify-center bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="mx-auto w-40 h-40">
            <img
            src="/crying-emoji.svg"
            alt="Sad mail icon"
            className="w-full h-full object-contain mx-auto"
            />
        </div>

        <h2 className="text-3xl font-bold text-gray-900">Oops! Verification Link Not Found</h2>
        <p className="text-md text-gray-600">
            We couldn’t find a valid link. It might be expired or incorrect.<br />
            Please check your email and try again!
        </p>

        <div className="mt-6">
            <Link href="/login">
            <span className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-blue-600 transition">
                Go to Login Page
            </span>
            </Link>
        </div>
        </div>
    </div>
    </>
  )
}

export default InvalidToken