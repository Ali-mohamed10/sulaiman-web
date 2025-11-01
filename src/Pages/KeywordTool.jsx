import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth, provider } from "../Firebase/firebase.config";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import Toast from "../Components/Toast";

const STORAGE_KEY = "keyword_tool_data";

export default function KeywordTool() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/keyword-tool/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      setToast({
        isVisible: true,
        message: "Failed to sign in. Please try again.",
        type: "error",
      });
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.keyword) setKeyword(parsed.keyword);
        if (parsed.results) setResults(parsed.results);
        if (parsed.relatedKeywords) setRelatedKeywords(parsed.relatedKeywords);
      }
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
    }
  }, []);

  const clearResults = () => {
    setKeyword("");
    setResults([]);
    setRelatedKeywords([]);
    setError("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  };

  // Generate realistic SEO metrics
  const generateSEOMetrics = (keyword, relatedKeywords) => {
    // SEO Score: random between 60-100
    const seoScore = Math.floor(Math.random() * 41) + 60;

    // Search Volume: (relatedKeywords.length × 100) + random(100, 500)
    const searchVolume =
      relatedKeywords.length * 100 + Math.floor(Math.random() * 401) + 100;

    // Average Length: calculate average length of related keywords or use main keyword
    let totalLength = 0;
    if (relatedKeywords.length > 0) {
      totalLength = relatedKeywords.reduce((sum, kw) => {
        const kwText = typeof kw === "string" ? kw : kw.keyword || "";
        return sum + kwText.length;
      }, 0);
      totalLength = Math.round(totalLength / relatedKeywords.length);
    } else {
      totalLength = keyword.length;
    }

    return {
      seoScore,
      searchVolume,
      averageLength: totalLength,
    };
  };

  const fetchKeywords = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setRelatedKeywords([]);

    try {
      const res = await fetch(
        `https://google-search74.p.rapidapi.com/?query=${encodeURIComponent(
          keyword
        )}&limit=10&related_keywords=true`,
        {
          headers: {
            "x-rapidapi-host": "google-search74.p.rapidapi.com",
            "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
          },
        }
      );

      const data = await res.json();
      console.log("API Data:", data);

      const related = data?.related_keywords?.keywords || [];
      const topResults = data?.results || [];

      setRelatedKeywords(related);
      setResults(topResults);

      // Generate SEO metrics
      const metrics = generateSEOMetrics(keyword.trim(), related);

      // Extract related keywords as array of strings
      const relatedKeywordsArray = related.map((item) =>
        typeof item === "string" ? item : item.keyword || ""
      );

      // Save to Firestore (only if user is logged in)
      if (user) {
        try {
          await addDoc(collection(db, "keyword_searches"), {
            uid: user.uid,
            keyword: keyword.trim(),
            searchDate: serverTimestamp(),
            averageSEOScore: metrics.seoScore,
            length: metrics.averageLength,
            relatedKeywords: relatedKeywordsArray,
          });

          // Show success toast
          setToast({
            isVisible: true,
            message: "Keyword analysis saved successfully! 🎉",
            type: "success",
          });
        } catch (firestoreError) {
          console.error("Error saving to Firestore:", firestoreError);
          setToast({
            isVisible: true,
            message: "Failed to save to dashboard. Please try again.",
            type: "error",
          });
        }
      }

      // Save to localStorage
      try {
        const dataToSave = {
          keyword: keyword.trim(),
          results: topResults,
          relatedKeywords: related,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (err) {
        console.error("Error saving to localStorage:", err);
      }
    } catch (err) {
      setError("Failed to fetch keywords. Please try again.");
      setToast({
        isVisible: true,
        message: "Failed to fetch keywords. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-3 py-10 text-gray-800 dark:text-gray-100">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-6">
          🔍 Keyword & SEO Analyzer
        </h1>
        <div className="flex items-center flex-wrap justify-center gap-4">
          {user ? (
            <>
              <Link
                to="/keyword-tool/dashboard"
                className="inline-flex items-center whitespace-nowrap gap-2 bg-main/80 hover:bg-main duration-300 text-white rounded-md px-2.5 py-1.5 font-medium"
              >
                <span>📊 View Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                  {user.displayName || "User"}
                </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        className="max-w-xl mx-auto flex flex-col md:flex-row items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Enter your keyword..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchKeywords()}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={user ? fetchKeywords : handleLogin}
          disabled={loading || !user}
          className="bg-main/80 hover:bg-main duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg transition shadow-md"
        >
          {!user ? "Login to Search" : loading ? "Searching..." : "Search"}
        </motion.button>
        {(results.length > 0 || relatedKeywords.length > 0) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearResults}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            Clear
          </motion.button>
        )}
      </motion.div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center mt-6 text-blue-500 animate-pulse">
          Fetching results...
        </p>
      )}
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}

      {/* Related Keywords */}
      {!loading && relatedKeywords.length > 0 && (
        <motion.div
          className="max-w-2xl mx-auto mt-10 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
            Related Keywords
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {relatedKeywords.map((item, i) => (
              <motion.li
                key={i}
                className="text-gray-800 dark:text-gray-200"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.keyword}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Top Search Results */}
      {!loading && results.length > 0 && (
        <motion.div
          className="max-w-3xl mx-auto mt-10 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
            Top Search Results
          </h2>
          <div className="space-y-4">
            {results.map((item, i) => (
              <motion.div
                key={i}
                className="border-b border-gray-200 dark:border-gray-700 pb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
