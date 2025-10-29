import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChosseScript() {
  const navigate = useNavigate();

  const getLanguageSettings = (mode) => {
    const settings = {
      "ar-ar": {
        label: "عربي إلى عربي",
        description: "تحويل الصوت العربي إلى نص عربي",
      },
      "ar-en": {
        label: "عربي إلى إنجليزي",
        description: "تحويل الصوت العربي إلى نص إنجليزي",
      },
      "en-ar": {
        label: "إنجليزي إلى عربي",
        description: "تحويل الصوت الإنجليزي إلى نص عربي",
      },
      "en-en": {
        label: "إنجليزي إلى إنجليزي",
        description: "تحويل الصوت الإنجليزي إلى نص إنجليزي",
      },
    };
    return settings[mode];
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          اختر نوع التحويل
        </h2>
        <p className="text-gray-600 text-center mb-6">
          اختر اللغة المصدر واللغة الهدف ثم انتقل لرفع الملف
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries({
            "ar-ar": "عربي إلى عربي",
            "ar-en": "عربي إلى إنجليزي",
            "en-ar": "إنجليزي إلى عربي",
            "en-en": "إنجليزي إلى إنجليزي",
          }).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => navigate(`/transcribe?mode=${mode}`)}
              className="p-4 border rounded-lg cursor-pointer text-center hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg font-medium">{label}</div>
              <div className="text-sm text-gray-600 mt-1">
                {getLanguageSettings(mode).description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
