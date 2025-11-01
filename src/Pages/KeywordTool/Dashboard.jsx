import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { calculateStats } from "../../utils/calculateAverages";
import AnimatedCounter from "../../Components/AnimatedCounter";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const StatCard = ({
  title,
  value,
  icon,
  delay = 0,
  decimals = 0,
  isString = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-background1 dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text2 uppercase tracking-wide">
          {title}
        </h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-text1">
        {isString ? (
          <span className="text-lg">{value || "N/A"}</span>
        ) : (
          <>
            <AnimatedCounter value={value} decimals={decimals} />
            {title === "Average SEO Score" && "%"}
            {title === "Average Keyword Length" && " chars"}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState({
    totalKeywords: 0,
    averageSEOScore: 0,
    averageLength: 0,
    mostSearched: null,
  });
  const navigate = useNavigate();

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        navigate("/keyword-tool");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Try to fetch with orderBy first (requires composite index)
      let querySnapshot;
      try {
        const q = query(
          collection(db, "keyword_searches"),
          where("uid", "==", user.uid),
          orderBy("searchDate", "desc"),
          limit(100)
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        // If index error, try without orderBy (will still filter by uid)
        console.warn(
          "Composite index may be missing, fetching without orderBy:",
          indexError
        );
        const q = query(
          collection(db, "keyword_searches"),
          where("uid", "==", user.uid),
          limit(100)
        );
        querySnapshot = await getDocs(q);
      }

      const fetchedData = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const searchDate =
          docData.searchDate?.toDate?.() ||
          docData.createdAt?.toDate?.() ||
          new Date();

        fetchedData.push({
          id: doc.id,
          keyword: docData.keyword || "",
          seoScore: docData.averageSEOScore || docData.seoScore || 0,
          averageLength: docData.length || docData.averageLength || 0,
          relatedKeywords: docData.relatedKeywords || [],
          createdAt: searchDate,
          uid: docData.uid || "",
        });
      });

      // Sort by date if we didn't use orderBy
      fetchedData.sort((a, b) => b.createdAt - a.createdAt);

      setData(fetchedData);

      // Calculate statistics
      const calculatedStats = calculateStats(fetchedData);
      setStats(calculatedStats);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);

      // Show more specific error messages
      let errorMessage = "Failed to load dashboard data. Please try again.";

      if (err.code === "permission-denied") {
        errorMessage =
          "Permission denied. Please check Firestore security rules.";
      } else if (err.code === "failed-precondition") {
        errorMessage =
          "Index required. Please check the browser console for the index creation link.";
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background2 py-8 px-4 md:px-6 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Prepare chart data for SEO Score trends over time
  const trendData = data
    .slice()
    .reverse()
    .slice(0, 20)
    .map((item) => ({
      date: format(item.createdAt, "MMM dd"),
      fullDate: format(item.createdAt, "MMM dd, yyyy"),
      seoScore: item.seoScore,
      keyword: item.keyword,
    }));

  // Prepare bar chart data for top keywords
  const chartData = data.slice(0, 10).map((item) => ({
    keyword:
      item.keyword.length > 15
        ? item.keyword.substring(0, 15) + "..."
        : item.keyword,
    fullKeyword: item.keyword,
    seoScore: item.seoScore,
    length: item.averageLength,
  }));

  // Prepare recent activity data
  const recentActivity = data.slice(0, 10).map((item) => ({
    ...item,
    formattedDate: format(item.createdAt, "MMM dd, yyyy HH:mm"),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background2 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-main border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background2 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400"
          >
            <h3 className="font-bold text-lg mb-2">
              ⚠️ Error Loading Dashboard
            </h3>
            <p className="mb-4">{error}</p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Possible solutions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check the browser console for detailed error messages</li>
                <li>Verify Firestore security rules are published</li>
                <li>
                  If you see an index error, click the link in the console to
                  create the required index
                </li>
                <li>Make sure you're logged in with the correct account</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              🔄 Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background2 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 justify-between mb-4">
            <div>
              <h1 className="text-text1 mb-3">
                Keyword Insights Dashboard
              </h1>
              <p className="text-text2 text-lg">
                Your personal analytics and insights for keyword searches
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-md"
                title="Refresh data"
              >
                🔄 Refresh
              </motion.button>
              <Link
                to="/keyword-tool"
                className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
              >
                <span>← Back to Search</span>
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
            >
              🔄 Refresh
            </motion.button>
            <Link
              to="/keyword-tool"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm"
            >
              <span>← Back</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Keywords"
            value={stats.totalKeywords}
            icon="📊"
            delay={0.1}
          />
          <StatCard
            title="Average SEO Score"
            value={stats.averageSEOScore}
            icon="⭐"
            delay={0.2}
            decimals={1}
          />
          <StatCard
            title="Average Keyword Length"
            value={stats.averageLength}
            icon="📏"
            delay={0.3}
            decimals={1}
          />
          <StatCard
            title="Most Searched"
            value={stats.mostSearched || "N/A"}
            icon="🔥"
            delay={0.35}
            isString={true}
          />
        </div>

        {/* SEO Score Trends Over Time */}
        {trendData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-background1 dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-text1 mb-6">
              SEO Score Trends Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  className="dark:stroke-gray-400"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  className="dark:stroke-gray-400"
                  label={{
                    value: "SEO Score (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#6b7280" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#1f2937",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload) {
                      return `${payload[0].payload.fullDate} - ${payload[0].payload.keyword}`;
                    }
                    return label;
                  }}
                  formatter={(value) => [`${value}%`, "SEO Score"]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="seoScore"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="SEO Score"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Top Keywords Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="bg-background1 dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-text1 mb-6">
              Top Keywords by SEO Score
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="keyword"
                  stroke="#6b7280"
                  className="dark:stroke-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#6b7280"
                  className="dark:stroke-gray-400"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#1f2937",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload) {
                      return payload[0].payload.fullKeyword || label;
                    }
                    return label;
                  }}
                  formatter={(value) => [`${value}%`, "SEO Score"]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
                <Bar
                  dataKey="seoScore"
                  fill="#3b82f6"
                  name="SEO Score"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Activity Table */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-background1 dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-text1 mb-6">
              Recent Activity
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-text1">
                      Keyword
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text1">
                      SEO Score
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text1">
                      Length
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text1">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text1">
                      Related Keywords
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-text1 font-medium">
                        {item.keyword}
                      </td>
                      <td className="py-4 px-4 text-text1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {item.seoScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-text2">
                        {item.averageLength} chars
                      </td>
                      <td className="py-4 px-4 text-text2 text-sm">
                        {item.formattedDate}
                      </td>
                      <td className="py-4 px-4 text-text2 text-sm">
                        {item.relatedKeywords &&
                        item.relatedKeywords.length > 0 ? (
                          <span className="text-xs">
                            {item.relatedKeywords.slice(0, 3).join(", ")}
                            {item.relatedKeywords.length > 3 && "..."}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-text2 text-xl mb-4">
              No keyword searches yet. Start analyzing keywords to see your
              personal dashboard!
            </p>
            <Link
              to="/keyword-tool"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
            >
              <span>🔍 Start Searching</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
