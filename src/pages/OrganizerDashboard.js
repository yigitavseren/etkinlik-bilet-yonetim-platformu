import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { Briefcase, TrendingUp, Users, Calendar, ArrowLeft, Plus, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5196/api";

function OrganizerDashboard() {
  const { user } = useContext(AuthContext);
  const { events, addEvent, updateEvent, deleteEvent } = useContext(EventContext);
  const navigate = useNavigate();
  const [ozet, setOzet] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifTab, setAktifTab] = useState("etkinlikler");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "konser", artist: "", price: "", venue: "", date: "", time: "21:00", image: "", description: ""
  });

  useEffect(() => {
    const verileriYukle = async () => {
      try {
        const token = user?.token;
        const res = await fetch(`${API_URL}/Rapor/organizator-ozet?orgId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setOzet(await res.json());
      } catch (err) {
        console.error("Veri yüklenemedi:", err);
      } finally {
        setYukleniyor(false);
      }
    };
    verileriYukle();
  }, []);

  const openAddForm = () => {
    setEditingEvent(null);
    setFormData({ name: "", category: "konser", artist: "", price: "", venue: "", date: "", time: "21:00", image: "", description: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(formData);
    } else {
      addEvent(formData);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (yukleniyor) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-dark)" }}>
      <div style={{ color: "var(--text-muted)" }}>Yükleniyor...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", padding: "48px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <ArrowLeft size={24} />
              </button>
              <Briefcase size={28} color="var(--primary)" />
              <h1 style={{ margin: 0, fontSize: "28px" }}>Organizatör Paneli</h1>
            </div>
            <p style={{ margin: 0, color: "var(--text-muted)", paddingLeft: "88px" }}>
              Hoş geldin, <strong style={{ color: "white" }}>{user?.name}</strong>
            </p>
          </div>
          {aktifTab === "etkinlikler" && (
            <button onClick={openAddForm} style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "var(--primary)", color: "white",
              border: "none", padding: "12px 24px", borderRadius: "8px",
              fontSize: "16px", fontWeight: 600, cursor: "pointer"
            }}>
              <Plus size={20} /> Yeni Etkinlik Ekle
            </button>
          )}
        </div>

        {/* Tab Menü */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button onClick={() => setAktifTab("etkinlikler")} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600,
            backgroundColor: aktifTab === "etkinlikler" ? "var(--primary)" : "rgba(255,255,255,0.08)",
            color: aktifTab === "etkinlikler" ? "white" : "var(--text-muted)"
          }}>Etkinlikler</button>
          <button onClick={() => setAktifTab("raporlar")} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600,
            backgroundColor: aktifTab === "raporlar" ? "var(--primary)" : "rgba(255,255,255,0.08)",
            color: aktifTab === "raporlar" ? "white" : "var(--text-muted)"
          }}>Raporlar</button>
        </div>

        {/* ETKİNLİKLER */}
        {aktifTab === "etkinlikler" && (
          <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                  {["Etkinlik", "Kategori / Mekan", "Tarih", "Fiyat", "İşlemler"].map(h => (
                    <th key={h} style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500, textAlign: h === "İşlemler" ? "right" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <img src={event.image} alt={event.name} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{event.name}</div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{event.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "12px", marginBottom: "4px", textTransform: "capitalize" }}>{event.category}</div>
                      <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{event.venue}</div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-muted)" }}>{event.date}<br /><span style={{ fontSize: "12px" }}>{event.time}</span></td>
                    <td style={{ padding: "16px 24px", fontWeight: 600, color: "var(--primary)" }}>{event.price} ₺</td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button onClick={() => openEditForm(event)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginRight: "16px" }}><Pencil size={18} /></button>
                      <button onClick={() => deleteEvent(event.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Henüz etkinlik yok.</div>}
          </div>
        )}

        {/* RAPORLAR */}
        {aktifTab === "raporlar" && (
          <div>
            {/* İstatistik Kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "32px" }}>
              <StatCard icon={<TrendingUp size={24} color="#2dc653" />} title="Toplam Gelir" value={`₺${ozet?.toplamGelir?.toLocaleString("tr-TR") || 0}`} renk="#2dc653" />
              <StatCard icon={<Users size={24} color="var(--primary)" />} title="Satılan Bilet" value={ozet?.toplamBilet || 0} renk="var(--primary)" />
              <StatCard icon={<Calendar size={24} color="#f4a261" />} title="Aktif Etkinlik" value={ozet?.aktifEtkinlik || 0} renk="#f4a261" />
              <StatCard icon={<X size={20} color="#ef4444" />} title="İade Bilet" value={ozet?.iadeBilet || 0} renk="#ef4444" />
            </div>

            {/* Etkinlik Performans Tablosu */}
            <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }}>
                <h2 style={{ margin: 0, fontSize: "20px" }}>Etkinlik Performansı</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                    {["Etkinlik", "Tarih", "Durum", "Doluluk", "Gelir"].map(h => (
                      <th key={h} style={{ padding: "14px 20px", color: "var(--text-muted)", fontWeight: 500, textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ozet?.etkinlikler?.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Henüz veri yok</td></tr>
                  ) : ozet?.etkinlikler?.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600 }}>{e.ad}</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{e.mekan}</div>
                      </td>
                      <td style={{ padding: "16px 20px", color: "var(--text-muted)" }}>{new Date(e.tarih).toLocaleDateString("tr-TR")}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                          backgroundColor: e.durum === "aktif" ? "#d4edda" : "#f8d7da",
                          color: e.durum === "aktif" ? "#155724" : "#721c24"
                        }}>{e.durum}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "80px", height: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                            <div style={{ width: `${Math.min(e.satisOrani, 100)}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "13px" }}>%{e.satisOrani?.toFixed(1)}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{e.satirlanKoltuk}/{e.toplamKoltuk} koltuk</div>
                      </td>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "var(--primary)" }}>{e.toplamGelir?.toLocaleString("tr-TR")} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL FORM */}
        {isFormOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
          }}>
            <div style={{
              backgroundColor: "var(--bg-card)", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "600px",
              maxHeight: "90vh", overflowY: "auto", border: "1px solid var(--border-color)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ margin: 0 }}>{editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}</h2>
                <button onClick={() => setIsFormOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Etkinlik Adı</label>
                    <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Sanatçı</label>
                    <input required name="artist" value={formData.artist} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Kategori</label>
                    <select required name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                      <option value="konser">Konser</option>
                      <option value="tiyatro">Tiyatro</option>
                      <option value="festival">Festival</option>
                      <option value="standup">Stand-Up</option>
                      <option value="workshop">Atölye</option>
                      <option value="blog">Seminer</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Fiyat (₺)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Mekan</label>
                    <input required name="venue" value={formData.venue} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tarih</label>
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Saat</label>
                    <input required type="time" name="time" value={formData.time} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Resim URL'si</label>
                  <input required name="image" value={formData.image} onChange={handleChange} placeholder="https://resimlinki.com/foto.jpg" style={inputStyle} />
                  {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: "12px", width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }} />}
                </div>
                <div>
                  <label style={labelStyle}>Açıklama</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button type="submit" style={{
                  padding: "16px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px",
                  fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "16px"
                }}>
                  {editingEvent ? "Değişiklikleri Kaydet" : "Etkinliği Oluştur"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, renk }) {
  return (
    <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: 700, color: renk }}>{value}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-dark)", color: "var(--text-main)", outline: "none", boxSizing: "border-box"
};

const labelStyle = {
  display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px"
};

export default OrganizerDashboard;