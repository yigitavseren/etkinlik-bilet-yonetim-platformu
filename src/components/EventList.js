import { useState, useMemo, useContext } from "react";
import EventCard from "./EventCard";
import CategoryNav from "./CategoryNav";
import FilterSidebar from "./FilterSidebar";
import HeroSlider from "./HeroSlider";
import { EventContext } from "../context/EventContext";

function EventList() {
  const { events } = useContext(EventContext);
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(3500);
  const [venueSearch, setVenueSearch] = useState("");
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        Number(e.price) <= Number(price) &&
        e.venue.toLowerCase().includes(venueSearch.toLowerCase()) &&
        (selectedVenues.length === 0 || selectedVenues.includes(e.venue)) &&
        (selectedDate === "" || e.date === selectedDate)
    );
  }, [category, price, venueSearch, selectedVenues, selectedDate]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)" }}>
      
      <HeroSlider />

      {/* KATEGORİ NAVİGASYONU */}
      <CategoryNav currentCategory={category} setCategory={setCategory} />

      {/* ANA İÇERİK ALANI */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row",
        padding: "32px", 
        gap: "32px",
        maxWidth: "1400px",
        margin: "0 auto",
        alignItems: "flex-start"
      }}>
        
        {/* SOL FİLTRE PANELİ */}
        <FilterSidebar 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          price={price}
          setPrice={setPrice}
          venueSearch={venueSearch}
          setVenueSearch={setVenueSearch}
          selectedVenues={selectedVenues}
          setSelectedVenues={setSelectedVenues}
        />

        {/* ETKİNLİK LİSTESİ */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
              {category === "all" ? "Tüm Etkinlikler" : `${category.charAt(0).toUpperCase() + category.slice(1)} Etkinlikleri`}
            </h2>
            <p style={{ margin: "8px 0 0 0", color: "var(--text-muted)", fontSize: "15px" }}>
              {filteredEvents.length} etkinlik bulundu
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "64px 0",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius)",
              border: "1px dashed var(--border-color)"
            }}>
              <p style={{ fontSize: "18px", color: "var(--text-muted)" }}>Aradığınız kriterlere uygun etkinlik bulunamadı.</p>
              <button 
                onClick={() => {
                  setCategory("all");
                  setPrice(3500);
                  setVenueSearch("");
                  setSelectedVenues([]);
                  setSelectedDate("");
                }}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventList;
