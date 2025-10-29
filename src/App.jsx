import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Auth/SignUp";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import AudioTranscriber from "./Components/AudioTranscriber";
import ChosseScript from "./Components/ChosseScript";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLogin") === "true";
    setIsLogin(loggedIn);
  }, []);

  return (
    <div>
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp setIsLogin={setIsLogin} />} />
        <Route path="/transcribe" element={<AudioTranscriber />} />
        <Route path="/choose" element={<ChosseScript />} />
      </Routes>
    </div>
  );
};

export default App;
