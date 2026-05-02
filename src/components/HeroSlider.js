import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../context/EventContext";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

function HeroSlider() {
  const { events } = useContext(EventContext);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sadece yüksek fiyatlı veya "öne çıkan" varsaydığımız ilk 4 etkinliği alalım
  const featuredEvents = events.slice(0, 4);

  // Otomatik kaydırma
  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredEvents.length);
    }, 5000); // 5 saniyede bir değişir
    return () => clearInterval(timer);
  }, [featuredEvents.length]);

  if (featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];

  return (
    <div style={{ position: "relative", width: "100%", height: "500px", overflow: "hidden", marginBottom: "48px" }}>
      
      {/* BACKGROUND IMAGE WITH BLUR & GRADIENT */}
      {featuredEvents.map((event, index) => (
        <div 
          key={event.id}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${event.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: 1
          }}
        />
      ))}

      {/* OVERLAY - KARARTMA */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 50%, transparent 100%)",
        zIndex: 2
      }} />

      {/* BOTTOM FADE FOR BLENDING WITH BACKGROUND */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "150px",
        background: "linear-gradient(to top, var(--bg-dark) 0%, transparent 100%)",
        zIndex: 3
      }} />

      {/* CONTENT */}
      <div style={{
        position: "relative", zIndex: 4, maxWidth: "1200px", margin: "0 auto", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px"
      }}>
        
        <div style={{ maxWidth: "600px", animation: "fadeInUp 0.8s ease-out forwards" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", backgroundColor: "var(--primary)", color: "white", borderRadius: "999px", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px", letterSpacing: "1px" }}>
            ÖNE ÇIKAN ETKİNLİK
          </div>
          
          <h1 style={{ fontSize: "56px", fontWeight: 800, margin: "0 0 16px 0", color: "white", lineHeight: 1.1, textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            {currentEvent.name}
          </h1>
          
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Calendar size={20} color="var(--primary)" /> {currentEvent.date}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={20} color="var(--primary)" /> {currentEvent.venue}</span>
          </p>

          <button 
            onClick={() => navigate(`/bilet/${currentEvent.id}`)}
            style={{
              padding: "16px 32px", backgroundColor: "white", color: "var(--bg-dark)", border: "none", borderRadius: "12px",
              fontSize: "18px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)", transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Bilet Al <ArrowRight size={20} />
          </button>
        </div>

      </div>

      {/* DOTS */}
      <div style={{ position: "absolute", bottom: "32px", right: "32px", zIndex: 5, display: "flex", gap: "12px" }}>
        {featuredEvents.map((_, index) => (
          <div 
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: index === currentIndex ? "32px" : "12px",
              height: "12px",
              borderRadius: "999px",
              backgroundColor: index === currentIndex ? "var(--primary)" : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          />
        ))}
      </div>

    </div>
  );
}

export default HeroSlider;
