import "./App.css";
import Main from "./components/Main";
import NotFoundPage from "./components/NotFoundPage";
import Viewfeed from "./components/Viewfeed";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/viewfeed" element={<Viewfeed />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
