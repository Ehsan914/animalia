import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import PublicApp from "./public/PublicApp"
import Navbar from "./components/ui/Navbar"
import Footer from "./components/ui/Footer"
import BannerBar from "./components/ui/BannerBar"
import IconSprite from "./components/ui/IconSprite"
import ScrollToTop from "./components/ui/ScrollToTop"
import PageLoader from "./components/ui/PageLoader"
import { SiteDataProvider } from "./context/SiteDataContext"

// The admin (and its stylesheet) loads only when someone opens /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"))

const App = () => {
  return (
    <>
      <IconSprite />
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={<PageLoader />}><AdminApp /></Suspense>} />
        <Route path="/*" element={
          <SiteDataProvider>
            <BannerBar />
            <Navbar />
            <main className="site-main">
              <PublicApp />
            </main>
            <Footer />
          </SiteDataProvider>}
        />
      </Routes>
    </>
  )
}
export default App;
