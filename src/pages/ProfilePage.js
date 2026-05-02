import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket as TicketIcon } from "lucide-react";

function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-dark)" }}>
        <h2>Lütfen Giriş Yapın</h2>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Ana Sayfa</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", padding: "48px 32px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <div>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: 0 }}>
              <ArrowLeft size={18} /> Ana Sayfaya Dön
            </button>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 700 }}>Profilim</h1>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Hoş geldin, <span style={{ color: "white", fontWeight: 500, textTransform: "capitalize" }}>{user.name}</span></p>
          </div>
          <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            Çıkış Yap
          </button>
        </div>

        <h2 style={{ fontSize: "24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}><TicketIcon color="var(--primary)" /> Biletlerim</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {user.tickets.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", backgroundColor: "var(--bg-card)", borderRadius: "16px", border: "1px dashed var(--border-color)", color: "var(--text-muted)" }}>
              Henüz hiç bilet satın almadınız.
            </div>
          ) : (
            user.tickets.map((ticket, index) => (
              <div key={index} style={{
                display: "flex", backgroundColor: "white", color: "black", borderRadius: "16px", overflow: "hidden", position: "relative"
              }}>
                {/* SOL KISIM - DETAYLAR */}
                <div style={{ flex: 1, padding: "24px", borderRight: "2px dashed #ccc", position: "relative" }}>
                   <div style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "#f1f5f9", color: "#64748b", borderRadius: "4px", fontSize: "12px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>{ticket.category}</div>
                   <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 800 }}>{ticket.eventName}</h3>
                   <div style={{ color: "#64748b", fontWeight: 500, marginBottom: "24px" }}>{ticket.artist}</div>
                   
                   <div style={{ display: "flex", gap: "32px" }}>
                     <div>
                       <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Tarih / Saat</div>
                       <div style={{ fontWeight: 600, fontSize: "14px" }}>{ticket.date} - {ticket.time}</div>
                     </div>
                     <div>
                       <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Mekan</div>
                       <div style={{ fontWeight: 600, fontSize: "14px" }}>{ticket.venue}</div>
                     </div>
                   </div>

                   <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
                     <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Koltuklar</div>
                     <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                       {ticket.seats.map(s => (
                         <span key={s} style={{ padding: "4px 8px", backgroundColor: "#0f172a", color: "white", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{s}</span>
                       ))}
                     </div>
                   </div>
                </div>

                {/* SAĞ KISIM - BARKOD */}
                <div style={{ width: "200px", backgroundColor: "#f8fafc", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Bilet Referans No</div>
                   <div style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "2px", color: "#0f172a", marginBottom: "24px" }}>{ticket.refCode}</div>
                   
                   {/* Fake QR/Barcode Placeholder */}
                   <div style={{ width: "120px", height: "120px", backgroundColor: "white", border: "8px solid white", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(5, 1fr)", gap: "2px" }}>
                     {Array.from({ length: 25 }).map((_, i) => (
                       <div key={i} style={{ backgroundColor: Math.random() > 0.4 ? "black" : "white" }}></div>
                     ))}
                   </div>
                </div>
                
                {/* YARIM AY KESİKLER (BİLET EFEKTİ) */}
                <div style={{ position: "absolute", top: "-15px", right: "185px", width: "30px", height: "30px", backgroundColor: "var(--bg-dark)", borderRadius: "50%" }}></div>
                <div style={{ position: "absolute", bottom: "-15px", right: "185px", width: "30px", height: "30px", backgroundColor: "var(--bg-dark)", borderRadius: "50%" }}></div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
