import { useState } from "react";
import { Calendar, Filter, MapPin, X } from "lucide-react";
import { venues } from "../data/events";

function FilterSidebar({
  selectedDate, setSelectedDate,
  price, setPrice,
  venueSearch, setVenueSearch,
  selectedVenues, setSelectedVenues
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const formatDate = (date, day) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  return (
    <div style={{
      width: "280px",
      minWidth: "280px",
      padding: "24px",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius)",
      backgroundColor: "var(--bg-card)",
      alignSelf: "flex-start",
      position: "sticky",
      top: "100px" // below navbar
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <Filter size={20} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Filtreler</h3>
      </div>

      {/* DATE FILTER */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-muted)" }}>Tarih</label>
        
        {selectedDate ? (
          <div style={{ display: "flex", gap: "8px" }}>
             <button
               style={{
                 flex: 1,
                 padding: "10px",
                 backgroundColor: "rgba(244, 63, 94, 0.1)",
                 color: "var(--primary)",
                 border: "1px solid var(--primary)",
                 borderRadius: "8px",
                 fontWeight: 500
               }}
             >
               {selectedDate}
             </button>
             <button
               onClick={() => setSelectedDate("")}
               style={{
                 padding: "10px",
                 backgroundColor: "var(--bg-card-hover)",
                 color: "var(--text-main)",
                 border: "1px solid var(--border-color)",
                 borderRadius: "8px",
                 cursor: "pointer"
               }}
             >
               <X size={18} />
             </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--bg-dark)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <Calendar size={18} /> Tarih Seç
          </button>
        )}

        {/* CALENDAR */}
        {showCalendar && !selectedDate && (
          <div style={{ marginTop: "12px", padding: "16px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-dark)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <button onClick={() => changeMonth(-1)} style={{ cursor: "pointer", background: "none", border: "none", color: "var(--text-main)" }}>◀</button>
              <strong style={{ fontSize: "14px" }}>
                {currentMonth.toLocaleString("tr-TR", { month: "long", year: "numeric" })}
              </strong>
              <button onClick={() => changeMonth(1)} style={{ cursor: "pointer", background: "none", border: "none", color: "var(--text-main)" }}>▶</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                const day = i + 1;
                const dateStr = formatDate(currentMonth, day);
                return (
                  <div
                    key={i}
                    onClick={() => { setSelectedDate(dateStr); setShowCalendar(false); }}
                    style={{
                      padding: "8px 0", textAlign: "center", cursor: "pointer", borderRadius: "6px",
                      fontSize: "13px", backgroundColor: "var(--bg-card)", color: "var(--text-main)",
                      transition: "0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--bg-card)"}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PRICE FILTER */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>Maksimum Fiyat</label>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>{price} ₺</span>
        </div>
        <input
          type="range"
          min="350"
          max="3500"
          step="50"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>350 ₺</span>
          <span>3500 ₺</span>
        </div>
      </div>

      {/* VENUE FILTER */}
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", fontSize: "14px", color: "var(--text-muted)" }}>
          <MapPin size={16} /> Mekanlar
        </label>
        <input
          placeholder="Mekan ara..."
          value={venueSearch}
          onChange={(e) => setVenueSearch(e.target.value)}
          style={{ 
            width: "100%", padding: "10px", marginBottom: "12px", boxSizing: "border-box",
            borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-dark)", color: "white"
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
          {venues
            .filter((v) => v.toLowerCase().includes(venueSearch.toLowerCase()))
            .map((v) => (
              <label key={v} style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "14px", color: "var(--text-main)", padding: "4px 0" }}>
                <input
                  type="checkbox"
                  checked={selectedVenues.includes(v)}
                  onChange={() => {
                    setSelectedVenues((prev) =>
                      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
                    );
                  }}
                  style={{ marginRight: "10px", accentColor: "var(--primary)", width: "16px", height: "16px", cursor: "pointer" }}
                />
                {v}
              </label>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
