import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventList from "./components/EventList";

function TicketPage() {
  return <h1 style={{ padding: "20px" }}>🎫 Bilet Sayfası</h1>;
}

function App() {
  const [hover, setHover] = useState(false);

  return (
    <BrowserRouter>

      {/* 🔥 TEK HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid #203c5f",
        backgroundColor: "#203c5f",
      }}>
        <h2 style={{ color: "#ffffff" }}>BiletBul</h2>

        <input
          placeholder="Etkinlik / Mekan / Sanatçı ara..."
          style={{
            width: "50%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d4cdcd"
          }}
        />

        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: "none",
            border: "none",
            color: hover ? "gray" : "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Giriş Yap
        </button>
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/bilet/:id" element={<TicketPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;