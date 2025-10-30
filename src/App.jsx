import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthContextProvider from "./context/AuthContext";
import Loader from "./Components/Loader";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./Pages/Home"));
const SignUp = lazy(() => import("./Auth/SignUp"));
const AudioTranscriber = lazy(() => import("./Components/AudioTranscriber"));
const ChosseScript = lazy(() => import("./Components/ChosseScript"));
const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
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
        </Route>
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
