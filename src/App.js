import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import EventList from "./components/EventList";
import Navbar from "./components/Navbar";
import TicketPage from "./pages/TicketPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [hover, setHover] = useState(false);

  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          {/* 🔥 YENİ NAVBAR */}
          <Navbar />

          {/* ROUTES */}
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/bilet/:id" element={<TicketPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;