import { Route, Routes, useLocation, Outlet } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthContextProvider from "./context/AuthContext";
import Loader from "./Components/Loader";
import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Home = lazy(() => import("./Pages/Home"));
const SignUp = lazy(() => import("./Auth/SignUp"));
const AudioTranscriber = lazy(() => import("./Components/AudioTranscriber"));
const ChosseScript = lazy(() => import("./Components/ChosseScript"));
const LoveCounter = lazy(() => import("./Components/LoveCounter"));
const KeywordTool = lazy(() => import("./Pages/KeywordTool"));
const KeywordDashboard = lazy(() => import("./Pages/KeywordTool/Dashboard"));

const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<AnimatedOutlet />}>
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="signup"
              element={
                <Suspense fallback={<Loader />}>
                  <SignUp />
                </Suspense>
              }
            />
            <Route
              path="transcribeDetails/:mode"
              element={
                <Suspense fallback={<Loader />}>
                  <AudioTranscriber />
                </Suspense>
              }
            />
            <Route
              path="transcribe"
              element={
                <Suspense fallback={<Loader />}>
                  <ChosseScript />
                </Suspense>
              }
            />
            <Route
              path="love-calculator"
              element={
                <Suspense fallback={<Loader />}>
                  <LoveCounter />
                </Suspense>
              }
            />
            <Route
              path="keyword-tool"
              element={
                <Suspense fallback={<Loader />}>
                  <KeywordTool />
                </Suspense>
              }
            />
            <Route
              path="keyword-tool/dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <KeywordDashboard />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
