import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { Briefcase, TrendingUp, Users, Calendar } from "lucide-react";

function OrganizerDashboard() {
  const { user } = useContext(AuthContext);
  const { events } = useContext(EventContext);

  // Sahte veriler
  const myEvents = events.slice(0, 3);
  const totalTickets = 1240;
  const totalRevenue = 185000;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Briefcase size={32} color="var(--primary)" />
        <h1 style={{ margin: 0, fontSize: "28px" }}>Organizatör Paneli</h1>
      </div>

      <div style={{ marginBottom: "24px", color: "var(--text-muted)" }}>
        Hoş geldin, <strong style={{ color: "var(--text-main)" }}>{user?.name}</strong>. Etkinliklerinin performansını buradan takip edebilirsin.
      </div>

      {/* İstatistikler */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <StatCard icon={<TrendingUp size={24} color="var(--success)" />} title="Toplam Ciro" value={`₺${totalRevenue.toLocaleString()}`} />
        <StatCard icon={<Users size={24} color="var(--primary)" />} title="Satılan Bilet" value={totalTickets} />
        <StatCard icon={<Calendar size={24} color="var(--warning)" />} title="Aktif Etkinlik" value={myEvents.length} />
      </div>

      {/* Etkinlik Listesi */}
      <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", padding: "24px" }}>
        <h2 style={{ margin: "0 0 20px 0", fontSize: "20px" }}>Etkinliklerim</h2>
        
        {myEvents.map(event => (
          <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border-color)", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src={event.image} alt={event.name} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{event.name}</h3>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{event.date} - {event.venue}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Satış Durumu</div>
              <div style={{ fontWeight: 600, color: "var(--success)" }}>%85 Dolu</div>
            </div>
            <button style={{ padding: "8px 16px", backgroundColor: "var(--bg-dark)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-main)", cursor: "pointer" }}>
              Düzenle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
