// src/App.jsx
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { StartPage } from "./pages/StartPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { ChangePassword } from "./pages/ChangePassword";
import { Profile } from "./pages/Profile";
import { SavedPrompts } from "./pages/Dialogs";
import { Favorites } from "./pages/Favorites";
import { PromptDialog } from "./pages/Dialog";
import { PromptBuilder } from "./pages/PromptBuilder";
import { About } from "./pages/About";
import { Guide } from "./pages/Guide";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);

  const renderPage = () => {
    const props = { setPage: setCurrentPage, user, setUser };
    switch (currentPage) {
      case "start": return <StartPage {...props} />;
      case "login": return <Login {...props} />;
      case "register": return <Register {...props} />;
      case "forgot": return <ForgotPassword {...props} />;
      case "reset": return <ResetPassword {...props} />;
      case "change-password": return <ChangePassword {...props} />;
      case "profile": return <Profile {...props} />;
      case "saved": return <SavedPrompts {...props} />;
      case "favorites": return <Favorites {...props} />;
      case "dialog": return <PromptDialog {...props} />;
      case "builder": return <PromptBuilder {...props} />;
      case "about": return <About {...props} />;
      case "guide": return <Guide {...props} />;
      default: return <StartPage {...props} />;
    }
  };
  // Здесь нужна проверка на существование юзера в локалсторадже, чтоб сразу перенаправляло на профиль
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user} 
        setPage={setCurrentPage} 
        setUser={setUser} 
        currentPage={currentPage}
      />
      
      <div className="flex flex-1">        
        <main className="flex-1 bg-gray-50">
          {renderPage()}
        </main>
      </div>

      <Footer />
    </div>
  );
}