import { X } from "lucide-react";
import { useMemo } from "react";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS_PER_ROW = 12;

function SeatMapModal({ isOpen, onClose, event, selectedSeats, setSelectedSeats }) {
  // Basit bir deterministik rastgele sayı üreteci (Event ID ve Koltuk İndeksine göre)
  // Böylece aynı etkinlikte her zaman aynı koltuklar dolu görünür.
  const isOccupied = (rowIdx, colIdx) => {
    const seatIndex = rowIdx * COLS_PER_ROW + colIdx;
    const seed = (event.id * 9301 + seatIndex * 49297) % 233280;
    const random = seed / 233280.0;
    return random < 0.35; // %35 ihtimalle dolu
  };

  // Koltuk durumlarını bir kere hesapla
  const seatLayout = useMemo(() => {
    if (!event) return [];
    return ROWS.map((rowLabel, rIdx) => {
      const seats = [];
      for (let cIdx = 1; cIdx <= COLS_PER_ROW; cIdx++) {
        const id = `${rowLabel}-${cIdx}`;
        seats.push({
          id,
          label: cIdx,
          isOccupied: isOccupied(rIdx, cIdx)
        });
      }
      return { rowLabel, seats };
    });
  }, [event]);

  if (!isOpen) return null;

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;
    
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(prev => prev.filter(id => id !== seat.id));
    } else {
      // Maksimum 6 koltuk seçimine izin verelim
      if (selectedSeats.length >= 6) {
        alert("Tek seferde en fazla 6 bilet alabilirsiniz.");
        return;
      }
      setSelectedSeats(prev => [...prev, seat.id]);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      padding: "24px"
    }}>
      <div style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "800px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden"
      }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>Koltuk Seçimi</h2>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "14px" }}>{event.name} - {event.venue}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "8px" }}><X size={24} /></button>
        </div>

        {/* BODY (SEAT MAP) */}
        <div style={{ padding: "32px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          
          {/* SAHNE */}
          <div style={{ 
            width: "80%", height: "40px", backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-color)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
            fontWeight: 600, letterSpacing: "4px", marginBottom: "48px"
          }}>
            SAHNE
          </div>

          {/* KOLTUKLAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {seatLayout.map((row) => (
              <div key={row.rowLabel} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "24px", fontWeight: 600, color: "var(--text-muted)", textAlign: "center" }}>{row.rowLabel}</div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  {row.seats.map((seat, idx) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    // Ortadaki koridoru yapmak için 6. koltuktan sonra ekstra boşluk
                    const isMiddle = idx === 5;
                    
                    let bgColor = "var(--bg-dark)"; // Müsait
                    let borderColor = "var(--border-color)";
                    let cursor = "pointer";

                    if (seat.isOccupied) {
                      bgColor = "#1e1e1e";
                      borderColor = "#333";
                      cursor = "not-allowed";
                    } else if (isSelected) {
                      bgColor = "var(--primary)";
                      borderColor = "var(--primary)";
                    }

                    return (
                      <div key={seat.id} style={{ display: "flex", alignItems: "center" }}>
                        <div
                          onClick={() => handleSeatClick(seat)}
                          style={{
                            width: "32px", height: "32px", borderRadius: "6px",
                            border: `1px solid ${borderColor}`,
                            backgroundColor: bgColor,
                            cursor: cursor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: 600,
                            color: isSelected ? "white" : (seat.isOccupied ? "#555" : "var(--text-muted)"),
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            if (!seat.isOccupied && !isSelected) {
                              e.currentTarget.style.borderColor = "var(--primary)";
                              e.currentTarget.style.color = "var(--text-main)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!seat.isOccupied && !isSelected) {
                              e.currentTarget.style.borderColor = "var(--border-color)";
                              e.currentTarget.style.color = "var(--text-muted)";
                            }
                          }}
                        >
                          {seat.label}
                        </div>
                        {isMiddle && <div style={{ width: "32px" }}></div>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ width: "24px", fontWeight: 600, color: "var(--text-muted)", textAlign: "center" }}>{row.rowLabel}</div>
              </div>
            ))}
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ padding: "20px 32px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", gap: "24px" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)" }}>
               <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "var(--bg-dark)", border: "1px solid var(--border-color)" }}></div> Boş
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)" }}>
               <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "var(--primary)" }}></div> Seçili
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)" }}>
               <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#1e1e1e", border: "1px solid #333" }}></div> Dolu
             </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: "10px 24px", backgroundColor: "var(--primary)", color: "white",
              border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer"
            }}
          >
            Seçimi Tamamla
          </button>
        </div>

      </div>
    </div>
  );
}

export default SeatMapModal;
