import { useNavigate } from "react-router-dom";

export default function ChosseScript() {
  const navigate = useNavigate();
  const getLanguageSettings = (mode) => {
    const settings = {
      "ar-ar": {
        label: "Arabic to Arabic",
        description: "Convert Arabic audio to Arabic text",
      },
      "ar-en": {
        label: "Arabic to English",
        description: "Convert Arabic audio to English text",
      },
      "en-ar": {
        label: "English to Arabic",
        description: "Convert English audio to Arabic text",
      },
      "en-en": {
        label: "English to English",
        description: "Convert English audio to English text",
      },
    };
    return settings[mode];
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-background1 dark:bg-background2 rounded-xl shadow-sm p-4">
        <h1 className="text-center text-text1 mb-2">
          Select Conversion Type
        </h1>
        <p className="text-text1/50 text-center mb-6">
          Choose source and target language, then proceed to upload your file
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries({
            "ar-ar": "Arabic to Arabic",
            "ar-en": "Arabic to English",
            "en-ar": "English to Arabic",
            "en-en": "English to English",
          }).map(([mode, label]) => (
            <div
              key={mode}
              onClick={() => navigate(`/transcribeDetails/${mode}`)}
              className="p-4 border rounded-lg cursor-pointer text-center hover:bg-background2 hover:dark:bg-background1 transition-colors"
            >
              <div className="text-lg font-medium">{label}</div>
              <div className="text-sm text-text1/50 mt-1">
                {getLanguageSettings(mode).description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
