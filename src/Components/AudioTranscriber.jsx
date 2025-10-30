import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChosseScript from "./ChosseScript";

const AudioTranscriber = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [audioFile, setAudioFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [transcriptionMode, setTranscriptionMode] = useState("ar-ar");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [suggestedMode, setSuggestedMode] = useState(null);

  useEffect(() => {
    const validModes = ["ar-ar", "ar-en", "en-ar", "en-en"];
    if (mode && validModes.includes(mode)) {
      setTranscriptionMode(mode);
      setShowModeSelector(false);
    }
  }, [mode]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        // 25MB limit
        setError("File size must be less than 25MB");
        return;
      }
      setAudioFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleGoSuggested = () => {
    if (!suggestedMode) return;
    navigate(`/transcribeDetails/${suggestedMode}`);
    setSuggestedMode(null);
    setError("");
    setAudioFile(null);
    setFileName("");
    setTranscription("");
    setShowModeSelector(false);
  };

  

  const detectAudioLanguage = async (audioUrl) => {
    // Make a lightweight detection request
    const resp = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: "9b452376153748d6a5e309b408059e81",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_detection: true,
        punctuate: false,
        speech_understanding: undefined,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Failed to start language detection");

    // poll until completed
    // reuse same polling style
    while (true) {
      const statusResp = await fetch(
        `https://api.assemblyai.com/v2/transcript/${data.id}`,
        {
          headers: {
            authorization: "9b452376153748d6a5e309b408059e81",
            "content-type": "application/json",
          },
        }
      );
      const status = await statusResp.json();
      if (status.status === "completed") {
        // language might be in language_code or detected_language
        return status.language_code || status.detected_language || null;
      }
      if (status.status === "error") {
        throw new Error(status.error || "Failed to detect language");
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  };

  const uploadFileWithProgress = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.assemblyai.com/v2/upload");
        xhr.setRequestHeader(
          "authorization",
          "9b452376153748d6a5e309b408059e81"
        );
        // content-type should be the file type or omitted for browser to set boundary
        if (file && file.type) {
          try {
            xhr.setRequestHeader("content-type", file.type);
          } catch {
            // ignore if browser controls it
          }
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch {
                reject(new Error("Failed to read upload response"));
              }
            } else {
              reject(new Error("File upload failed"));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Connection error during upload"));

        xhr.send(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setError("File size must be less than 25MB");
        return;
      }
      setAudioFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const getLanguageSettings = (mode) => {
    const settings = {
      "ar-ar": {
        language_code: "ar",
        targetLanguage: "ar",
        label: "Arabic to Arabic",
        description: "Convert Arabic audio to Arabic text",
      },
      "ar-en": {
        language_code: "ar",
        targetLanguage: "en",
        label: "Arabic to English",
        description: "Convert Arabic audio to English text",
      },
      "en-ar": {
        language_code: "en",
        targetLanguage: "ar",
        label: "English to Arabic",
        description: "Convert English audio to Arabic text",
      },
      "en-en": {
        language_code: "en",
        targetLanguage: "en",
        label: "English to English",
        description: "Convert English audio to English text",
      },
    };
    return settings[mode] || settings["ar-ar"];
  };

  const transcribeAudio = async () => {
    if (!audioFile) {
      setError("Please select an audio file first");
      return;
    }

    setIsTranscribing(true);
    setError("");
    setTranscription("");

    const languageSettings = getLanguageSettings(transcriptionMode);
    const isTranslation =
      languageSettings.language_code !== languageSettings.targetLanguage;

    try {
      // 1. Upload with progress
      setIsUploading(true);
      setUploadProgress(0);
      const uploadData = await uploadFileWithProgress(audioFile);
      setIsUploading(false);

      // 2. Detect language, block if mismatch
      let detectedLang = null;
      try {
        detectedLang = await detectAudioLanguage(uploadData.upload_url);
      } catch (e) {
        // If detection fails, continue to transcription but log the error
        console.warn("Language detection failed, proceeding anyway:", e);
      }

      if (detectedLang && detectedLang !== languageSettings.language_code) {
        const recommended = `${detectedLang}-${languageSettings.targetLanguage}`;
        const validModes = ["ar-ar", "ar-en", "en-ar", "en-en"];
        const finalRecommended = validModes.includes(recommended)
          ? recommended
          : `${detectedLang}-${detectedLang}`;
        setSuggestedMode(finalRecommended);
        setIsTranscribing(false);
        setError(
          detectedLang === "en"
            ? "The uploaded file is in English, but you selected Arabic as the source language. Please switch to the appropriate script."
            : "The uploaded file is in Arabic, but you selected English as the source language. Please switch to the appropriate script."
        );
        return;
      }

      // 3. Start transcription with language settings
      const response = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        body: JSON.stringify(
          (() => {
            const body = {
              audio_url: uploadData.upload_url,
              language_code: languageSettings.language_code,
              speaker_labels: true,
              punctuate: true,
              format_text: true,
              ...(isTranslation && {
                speech_understanding: {
                  request: {
                    translation: {
                      target_languages: [languageSettings.targetLanguage],
                    },
                  },
                },
              }),
            };
            return body;
          })()
        ),
        headers: {
          authorization: "9b452376153748d6a5e309b408059e81",
          "content-type": "application/json",
        },
      });

      const transcriptResponse = await response.json();
      if (!response.ok) {
        throw new Error(transcriptResponse.error || "Failed to start conversion process");
      }

      // 3. Poll for transcription result
      const checkStatus = async () => {
        try {
          const statusResponse = await fetch(
            `https://api.assemblyai.com/v2/transcript/${transcriptResponse.id}`,
            {
              headers: {
                authorization: "9b452376153748d6a5e309b408059e81",
                "content-type": "application/json",
              },
            }
          );

          const statusData = await statusResponse.json();
          console.log("Transcription status:", statusData.status);

          if (statusData.status === "completed") {
            if (
              isTranslation &&
              statusData.translated_texts &&
              statusData.translated_texts[languageSettings.targetLanguage]
            ) {
              setTranscription(
                statusData.translated_texts[languageSettings.targetLanguage] ||
                  "No translated text available"
              );
            } else {
              setTranscription(statusData.text || "No text available");
            }
            setIsTranscribing(false);
          } else if (statusData.status === "error") {
            throw new Error(statusData.error || "Failed to convert audio to text");
          } else {
            // If not completed and no error, check again after delay
            setTimeout(checkStatus, 2000);
          }
        } catch (err) {
          console.error("Error checking status:", err);
          setError(`Error: ${err.message}`);
          setIsTranscribing(false);
        }
      };

      // Start polling
      checkStatus();
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError(`An error occurred: ${err.message || "Please try again"}`);
      setIsTranscribing(false);
      setIsUploading(false);
    }
  };

  const renderUploader = () => (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("audio-upload").click()}
    >
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-700">
          {fileName || "Drag and drop an audio file here"}
        </p>
        <p className="text-sm text-gray-500">
          or click to select from your device (max 25MB)
        </p>
      </div>
    </div>
  );

  const renderTranscriptionResult = () => (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transcription Result:</h3>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {getLanguageSettings(transcriptionMode).label}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {transcription ? (
          <p className="whitespace-pre-line text-gray-800">{transcription}</p>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Transcribed text will appear here</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setTranscription("");
            setAudioFile(null);
            setShowModeSelector(true);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Start New Conversion
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-background2 rounded-xl shadow-sm pt-4">
        <h2 className="text-2xl font-bold text-center text-text1 mb-2">
          Audio to Text Conversion
        </h2>
        <p className="text-text1 text-center">
          Convert your audio files to text with high accuracy
        </p>
        {!showModeSelector && (
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getLanguageSettings(transcriptionMode).label}
            </div>
          </div>
        )}
        <div className="mt-4" />

        {showModeSelector ? (
          <ChosseScript
            onChoose={(mode) => {
              setTranscriptionMode(mode);
              setShowModeSelector(false);
            }}
            getLanguageSettings={getLanguageSettings}
          />
        ) : (
          <>
            {!transcription ? renderUploader() : renderTranscriptionResult()}

            {!transcription && audioFile && (
              <div className="mt-4 flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-text1">
                    {fileName}
                  </span>
                </div>
                <button
                  onClick={() => setAudioFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {isUploading && (
              <div className="mt-4 bg-background2">
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-blue-600 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-text1 text-center">
                  Uploading file... {uploadProgress}%
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <div>{error}</div>
                {suggestedMode && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleGoSuggested}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Go to the appropriate script
                    </button>
                    <button
                      className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                    >
                      Choose another mode
                    </button>
                  </div>
                )}
              </div>
            )}

            {!transcription && audioFile && (
              <button
                onClick={transcribeAudio}
                disabled={isTranscribing || isUploading}
                className={`mt-6 w-full py-3 px-6 rounded-lg text-black font-medium duration-300 shadow-lg shadow-gray-400 text-lg flex items-center justify-center space-x-2 ${
                  isTranscribing || isUploading
                    ? "bg-background2 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading file... {uploadProgress}%
                  </>
                ) : isTranscribing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-6-18v4m0 0H8m4 0h4M5 7a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                    <span>Start Conversion</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AudioTranscriber;
