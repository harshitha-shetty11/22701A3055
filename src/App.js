import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UrlShortenerPage from "./pages/UrlShortenerPage";
import RedirectHandler from "./pages/RedirectHandler";
import StatsPage from "./pages/StatsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/statistics" element={<StatsPage />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
