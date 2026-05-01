import { useState } from "react";
import EventCard from "./EventCard";

function EventList() {
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(3500);
  const [venueSearch, setVenueSearch] = useState("");
  const [selectedVenues, setSelectedVenues] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const events = [
    { id: 1, name: "Harbiye Konser", category: "konser", artist: "Tarkan", price: 1200, venue: "Harbiye Açık Hava", date: "2026-05-10", image: "[images.unsplash.com](https://images.unsplash.com/photo-1506157786151-b8491531f063)" },
    { id: 2, name: "Tiyatro Oyunu", category: "tiyatro", artist: "Devlet Tiyatrosu", price: 400, venue: "Devlet Tiyatrosu", date: "2026-05-12", image: "[images.unsplash.com](https://images.unsplash.com/photo-1507924538820-ede94a04019d)" },
    { id: 3, name: "Elektronik Festival", category: "festival", artist: "DJ Set", price: 2000, venue: "KüçükÇiftlik Park", date: "2026-05-15", image: "[images.unsplash.com](https://images.unsplash.com/photo-1518972559570-7cc1309f3229)" },
    { id: 4, name: "Büyük Konser", category: "konser", artist: "Sezen Aksu", price: 1500, venue: "İstanbul Arena", date: "2026-06-05", image: "[images.unsplash.com](https://images.unsplash.com/photo-1509024734204-dae9dbf0f8da)" },
    { id: 5, name: "Çocuk Tiyatrosu", category: "tiyatro", artist: "Çocuk Tiyatrosu", price: 350, venue: "Çocuk Merkezi", date: "2026-06-10", image: "[images.unsplash.com](https://images.unsplash.com/photo-1517495731467-99fdc8f321e2)" },
    { id: 6, name: "Yaz Festival", category: "festival", artist: "DJ Mert", price: 2000, venue: "KüçükÇiftlik Park", date: "2026-06-20", image: "[images.unsplash.com](https://images.unsplash.com/photo-1507682877402-e3f3d97765d7)" },
    { id: 7, name: "Stand-Up Show", category: "standup", artist: "Kemal Sunal", price: 700, venue: "BKM", date: "2026-07-01", image: "[images.unsplash.com](https://images.unsplash.com/photo-1502067809079-ea3ba7e4a7f9)" },
    { id: 8, name: "Müzik Atölyesi", category: "workshop", artist: "Murat Boz", price: 800, venue: "Mall of İstanbul", date: "2026-07-15", image: "[images.unsplash.com](https://images.unsplash.com/photo-1521791136066-5691ff60adf9)" },
    { id: 9, name: "Blog Yazarlığı Semineri", category: "blog", artist: "Yusuf Aydın", price: 350, venue: "İstanbul Üniversitesi", date: "2026-08-02", image: "[images.unsplash.com](https://images.unsplash.com/photo-1511498364410-54a8f19403be)" },
    { id: 10, name: "Yoga ve Meditasyon", category: "workshop", artist: "Ayşe Kucuk", price: 450, venue: "BKM", date: "2026-08-10", image: "[images.unsplash.com](https://images.unsplash.com/photo-1529663553885-73fc4b1e9209)" },
    { id: 11, name: "Şiir Akşamı", category: "tiyatro", artist: "İstanbul Şiir Grubu", price: 250, venue: "Harbiye Açık Hava", date: "2026-09-20", image: "[images.unsplash.com](https://images.unsplash.com/photo-1460137305512-d6a1c69a1577)" },
    { id: 12, name: "Klasik Müzik Konseri", category: "konser", artist: "İstanbul Senfoni Orkestrası", price: 1800, venue: "Çırağan Sarayı", date: "2026-09-25", image: "[images.unsplash.com](https://images.unsplash.com/photo-1461435954872-97dbb4041717)" },
    { id: 13, name: "Rock Festivali", category: "festival", artist: "Manga", price: 1000, venue: "KüçükÇiftlik Park", date: "2026-10-10", image: "[images.unsplash.com](https://images.unsplash.com/photo-1522119575857-4e3b5d24417f)" },
    { id: 14, name: "Dünya Turu Gösterisi", category: "tiyatro", artist: "Yılmaz Erdoğan", price: 1200, venue: "BKM", date: "2026-10-15", image: "[images.unsplash.com](https://images.unsplash.com/photo-1505097084053-bf6d4d9c7de1)" },
    { id: 15, name: "Jazz Konseri", category: "konser", artist: "Pinar Ayhan", price: 1000, venue: "KüçükÇiftlik Park", date: "2026-11-01", image: "[images.unsplash.com](https://images.unsplash.com/photo-1506665245739-f42cbbe12998)" },
    { id: 16, name: "Edebiyat Akşamı", category: "blog", artist: "Metin Hara", price: 550, venue: "İstanbul Tiyatrosu", date: "2026-11-10", image: "[images.unsplash.com](https://images.unsplash.com/photo-1506574388767-56004969a11e)" },
  ];

  const venues = [
    "Harbiye Açık Hava",
    "KüçükÇiftlik Park",
    "Devlet Tiyatrosu",
    "BKM",
    "Mall of İstanbul",
  ];

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

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

  const filtered = events.filter(
    (e) =>
      (category === "all" || e.category === category) &&
      Number(e.price) <= Number(price) &&
      e.venue.toLowerCase().includes(venueSearch.toLowerCase()) &&
      (selectedVenues.length === 0 || selectedVenues.includes(e.venue)) &&
      (selectedDate === "" || e.date === selectedDate)
  );

  return (
    <div>
      {/* CATEGORY BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {["all", "konser", "tiyatro", "festival", "elektronik", "standup", "cocuk", "workshop", "blog"].map((cat) => (
          <div
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              cursor: "pointer",
              color: category === cat ? "#ff4d4f" : "black",
              fontWeight: category === cat ? "bold" : "normal",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* MAIN AREA */}
      <div style={{ display: "flex", padding: "15px", gap: "15px" }}>
        {/* LEFT FILTER */}
        <div
          style={{
            width: "220px",
            minWidth: "220px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "#fff",
            alignSelf: "flex-start",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Filtreler</h3>

          {/* DATE BUTTON */}
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            📅 {selectedDate || "Tarih Seç"}
          </button>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              style={{
                width: "100%",
                padding: "6px 12px",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Temizle
            </button>
          )}

          {/* CALENDAR */}
          {showCalendar && (
            <div
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              {/* MONTH HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button onClick={() => changeMonth(-1)} style={{ cursor: "pointer" }}>
                  ◀
                </button>
                <strong style={{ fontSize: "14px" }}>
                  {currentMonth.toLocaleString("tr-TR", {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                <button onClick={() => changeMonth(1)} style={{ cursor: "pointer" }}>
                  ▶
                </button>
              </div>

              {/* DAYS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                }}
              >
                {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(currentMonth, day);
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setShowCalendar(false);
                      }}
                      style={{
                        padding: "6px 2px",
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "12px",
                        backgroundColor: isSelected ? "#ff4d4f" : "#f2f2f2",
                        color: isSelected ? "white" : "black",
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRICE */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ margin: "0 0 5px" }}>Fiyat: 0 - {price} TL</p>
            <input
              type="range"
              min="350"
              max="3500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* VENUE SEARCH */}
          <div style={{ marginBottom: "10px" }}>
            <input
              placeholder="Mekan ara..."
              value={venueSearch}
              onChange={(e) => setVenueSearch(e.target.value)}
              style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
            />
          </div>

          {/* VENUE CHECKBOX */}
          <div>
            {venues
              .filter((v) => v.toLowerCase().includes(venueSearch.toLowerCase()))
              .map((v) => (
                <label
                  key={v}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedVenues.includes(v)}
                    onChange={() => {
                      setSelectedVenues((prev) =>
                        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
                      );
                    }}
                  />
                  <span style={{ marginLeft: "6px" }}>{v}</span>
                </label>
              ))}
          </div>
        </div>

        {/* EVENTS */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "15px",
          }}
        >
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventList;
