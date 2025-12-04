const WebsiteCareerRequests = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Career Requests from Website</h2>
            <p className="text-sm sm:text-base text-gray-500">This section is currently under development</p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600">
            Track and manage all career requests submitted through your website.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-gray-700">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">⚡</span>
              <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🔍</span>
              <span className="text-sm font-medium text-gray-700">Smart Search</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium text-gray-700">Bulk Operations</span>
            </div>
          </div>

          <button className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto">
            Get Notified
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCareerRequests;
