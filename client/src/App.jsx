import Button from "./components/ui/Button";
import Navbar from './components/ui/Navbar';
import { InstagramIcon, FacebookIcon } from './components/icons/pixel-icons';
import { Routes, Route } from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import Footer from "./components/ui/Footer";
import PublicApp from "./public/PublicApp";
import { SiteDataProvider } from "./context/SiteDataContext";
import ScrollToTop from "./components/ui/ScrollToTop";
import BannerBar from "./components/ui/BannerBar";


const App = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={
        <SiteDataProvider>
          <BannerBar />
          <Navbar />
          <PublicApp />
          <Footer />
        </SiteDataProvider>}
      />

    </Routes>
    </>
  )
}
export default App;

