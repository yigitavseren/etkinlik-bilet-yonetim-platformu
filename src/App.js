import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import EventList from "./components/EventList";
import Navbar from "./components/Navbar";
import TicketPage from "./pages/TicketPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
            
            {/* Sadece giriş yapmış olanlar görebilir */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Sadece admin görebilir */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Sadece organizatör görebilir */}
            <Route path="/organizer" element={
              <ProtectedRoute requiredRole="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;