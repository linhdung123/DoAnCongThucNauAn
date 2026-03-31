import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import TipsPage from "./pages/TipsPage.jsx";
import TipDetailPage from "./pages/TipDetailPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import RecipeManagePage from "./pages/RecipeManagePage.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/tips/:slug" element={<TipDetailPage />} />
        <Route path="/muc-luc" element={<RecipeManagePage />} />
        <Route
          path="/yeu-thich"
          element={
            <PlaceholderPage
              title="Món yêu thích"
              description="Lưu món yêu thích — tính năng có thể nối với tài khoản người dùng sau."
            />
          }
        />
        <Route
          path="/gioi-thieu"
          element={
            <PlaceholderPage
              title="Giới thiệu"
              description="Dự án Cooks Delight — tips nấu ăn và công thức cho người Việt."
            />
          }
        />
      </Routes>
    </div>
  );
}
