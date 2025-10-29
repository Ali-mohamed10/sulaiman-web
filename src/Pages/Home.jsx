import { useState } from 'react';
import AudioTranscriber from '../Components/AudioTranscriber';

export default function Home() {
  const [isLoggedIn] = useState(localStorage.getItem("isLogin") === "true");
  const [showTranscriber, setShowTranscriber] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isLoggedIn ? 'مرحباً بك في نظام تحويل الصوت لنص' : 'نظام تحويل الصوت إلى نص'}
          </h1>
          <p className="text-xl text-gray-600">
            قم بتحويل ملفاتك الصوتية إلى نصوص بكل سهولة
          </p>
        </div>

        {isLoggedIn ? (
          <div className="bg-white rounded-xl shadow-md">
            {showTranscriber ? (
              <AudioTranscriber />
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">ابدأ تحويل الصوت إلى نص</h2>
                <button
                  onClick={() => setShowTranscriber(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 cursor-pointer rounded-lg text-lg transition-colors duration-200 flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-6-6a3 3 0 010-6V5a3 3 0 116 0v1a3 3 0 010 6z" />
                  </svg>
                  ابدأ التحويل الآن
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <div className="max-w-md mx-auto">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-yellow-700">
                      يرجى تسجيل الدخول لاستخدام خدمة تحويل الصوت إلى نص
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                سجل الدخول الآن للتمتع بميزة تحويل الصوت إلى نص بجودة عالية
              </p>
              <a
                href="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                سجل الدخول للبدء
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
