const WebsiteContactRequests = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Contact Requests from Website</h2>
            <p className="text-sm sm:text-base text-gray-500">This section is currently under development</p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600">
            Track and manage all contact requests submitted through your website.
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

          <button className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 mx-auto">
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

export default WebsiteContactRequests;

