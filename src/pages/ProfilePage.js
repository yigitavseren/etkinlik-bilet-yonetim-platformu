import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket as TicketIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const API_URL = "http://localhost:5196/api";

function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [biletler, setBiletler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (user) biletleriYukle();
  }, [user]);

  const biletleriYukle = async () => {
    try {
      const res = await fetch(`${API_URL}/Bilet/kullanici/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBiletler(data);
      }
    } catch (err) {
      console.error("Biletler yüklenemedi:", err);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleIade = async (biletId) => {
    if (!window.confirm("Bu bileti iade etmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`${API_URL}/Bilet/${biletId}/iade`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setBiletler(prev => prev.filter(b => b.id !== biletId));
        alert("Biletiniz başarıyla iade edildi.");
      } else {
        alert("İade işlemi başarısız oldu.");
      }
    } catch {
      alert("Sunucuya ulaşılamadı.");
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-dark)" }}>
        <h2>Lütfen Giriş Yapın</h2>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Ana Sayfa</button>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate("/"); };

  // API'den gelen bilet mi yoksa localStorage'dan mı olduğunu anlıyoruz
  const gosterilenBiletler = biletler;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", padding: "48px 32px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <div>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: 0 }}>
              <ArrowLeft size={18} /> Ana Sayfaya Dön
            </button>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 700 }}>Profilim</h1>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Hoş geldin, <span style={{ color: "white", fontWeight: 500 }}>{user.name}</span></p>
          </div>
          <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            Çıkış Yap
          </button>
        </div>

        <h2 style={{ fontSize: "24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <TicketIcon color="var(--primary)" /> Biletlerim
        </h2>

        {yukleniyor ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Yükleniyor...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {gosterilenBiletler.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", backgroundColor: "var(--bg-card)", borderRadius: "16px", border: "1px dashed var(--border-color)", color: "var(--text-muted)" }}>
                Henüz hiç bilet satın almadınız.
              </div>
            ) : (
              gosterilenBiletler.map((ticket, index) => {
                // API'den gelen bilet formatı ile localStorage formatını birleştir
                const biletId = ticket.id;
                const etkinlikAd = ticket.eventName || ticket.etkinlikAd;
                const etkinlikMekan = ticket.venue || ticket.etkinlikMekan;
                const tarih = ticket.date || (ticket.etkinlikTarih ? new Date(ticket.etkinlikTarih).toLocaleDateString("tr-TR") : "");
                const koltuklar = ticket.seats || [ticket.koltukNo];
                const refCode = ticket.refCode || `BLT-${ticket.id}`;

                return (
                  <div key={index} style={{ display: "flex", backgroundColor: "white", color: "black", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
                    {/* SOL KISIM */}
                    <div style={{ flex: 1, padding: "24px", borderRight: "2px dashed #ccc", position: "relative" }}>
                      <div style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "#f1f5f9", color: "#64748b", borderRadius: "4px", fontSize: "12px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>
                        {ticket.category || "Etkinlik"}
                      </div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 800 }}>{etkinlikAd}</h3>
                      <div style={{ color: "#64748b", fontWeight: 500, marginBottom: "24px" }}>{ticket.artist || ""}</div>

                      <div style={{ display: "flex", gap: "32px" }}>
                        <div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Tarih</div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{tarih}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Mekan</div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{etkinlikMekan}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Koltuklar</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {koltuklar.map((s, i) => (
                            <span key={i} style={{ padding: "4px 8px", backgroundColor: "#0f172a", color: "white", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* İADE BUTONU */}
                      <button
                        onClick={() => handleIade(biletId)}
                        style={{
                          marginTop: "20px", padding: "8px 16px",
                          backgroundColor: "transparent", color: "#ef4444",
                          border: "1px solid #ef4444", borderRadius: "6px",
                          fontSize: "13px", fontWeight: 600, cursor: "pointer"
                        }}
                      >
                        Bileti İade Et
                      </button>
                    </div>

                    {/* SAĞ KISIM - QR */}
                    <div style={{ width: "200px", backgroundColor: "#f8fafc", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Referans No</div>
                      <div style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "2px", color: "#0f172a", marginBottom: "24px" }}>{refCode}</div>
                      <QRCodeSVG
                        value={`BiletBul|${refCode}|${etkinlikAd}|${tarih}|${koltuklar.join(",")}`}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                        level="M"
                      />
                    </div>

                    {/* YARIM AY KESİKLER */}
                    <div style={{ position: "absolute", top: "-15px", right: "185px", width: "30px", height: "30px", backgroundColor: "var(--bg-dark)", borderRadius: "50%" }}></div>
                    <div style={{ position: "absolute", bottom: "-15px", right: "185px", width: "30px", height: "30px", backgroundColor: "var(--bg-dark)", borderRadius: "50%" }}></div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;