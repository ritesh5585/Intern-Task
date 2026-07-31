import { Routes, Route } from "react-router-dom";
import UrlGeneratorPage from "./UrlGeneratorPage";
import ThankYouPage from "./ThankYouPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UrlGeneratorPage />} />
      <Route path="/:company/:product" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;