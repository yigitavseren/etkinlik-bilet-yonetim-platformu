import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EventCard({ event }) {
  const navigate = useNavigate();
  const [hoverTitle, setHoverTitle] = useState(false);

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "#fff",
      width: "300px",
      display: "flex",
      flexDirection: "column"
    }}>

      <img
        src={event.image}
        alt={event.name}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover"
        }}
      />

      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>

        {/* 🎯 TIKLANABİLİR BAŞLIK */}
        <h3
          onClick={() => navigate(`/bilet/${event.id}`)}
          onMouseEnter={() => setHoverTitle(true)}
          onMouseLeave={() => setHoverTitle(false)}
          style={{
            margin: "0",
            cursor: "pointer",
            color: hoverTitle ? "#ff4d4f" : "black",
            transition: "0.2s"
          }}
        >
          {event.name}
        </h3>

        <p style={{ margin: "0", fontSize: "14px" }}>
          📍 Mekan: {event.venue}
        </p>

        <p style={{ margin: "0", fontSize: "14px" }}>
          📅 Tarih: {event.date}
        </p>

        <p style={{ margin: "0", fontWeight: "bold" }}>
          💰 {event.price} TL
        </p>

      </div>
    </div>
  );
}

export default EventCard;