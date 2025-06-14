import Link from "next/link"

const InvalidToken = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="mx-auto w-40 h-40">
            <img
            src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749783916/crying-emoji_nfvxlg.svg"
            alt="Sad mail icon"
            className="w-full h-full object-contain mx-auto"
            />
        </div>

        <h2 className="text-3xl font-bold text-gray-900">Oops! Verification Link Not Found</h2>
        <p className="text-md text-gray-600">
            We could not find a valid link. It might be expired or incorrect.<br />
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
  )
}

export default InvalidToken