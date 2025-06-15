const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center h-64 text-center text-gray-600">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 9.75L14.25 14.25M9.75 14.25L14.25 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            />
        </svg>
        <p className="text-lg font-semibold mb-1">Order Not Found</p>
        <p className="text-sm text-gray-500 mb-4">We couldn't find any order with the provided ID.</p>
        <button
            onClick={() => window.history.back()}
            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer transition"
        >
            Back to Previous Page
        </button>
    </div>
  )
}

export default NotFound