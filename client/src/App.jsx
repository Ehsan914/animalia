import Button from "./components/ui/Button";
import Navbar from './components/ui/Navbar';
import { InstagramIcon, FacebookIcon } from './components/icons/pixel-icons';
import { Routes, Route } from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import Footer from "./components/ui/Footer";
import PublicApp from "./public/PublicApp";


const App = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={
        <>
          <Navbar /> 
          <PublicApp />
          <Footer />
        </>}
      />
        
    </Routes>
  )
}
export default App;

