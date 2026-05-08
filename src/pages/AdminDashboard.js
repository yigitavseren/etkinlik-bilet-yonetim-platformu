import { useContext, useState, useEffect } from "react";
import { EventContext } from "../context/EventContext";
import { Pencil, Trash2, Plus, X, ArrowLeft, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5196/api";
const getToken = () => {
  const user = localStorage.getItem('biletbul_user');
  return user ? JSON.parse(user).token : null;
};

function AdminDashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useContext(EventContext);
  const [aktifTab, setAktifTab] = useState("etkinlikler");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "konser", artist: "", price: "", venue: "", date: "", time: "21:00", image: "", description: ""
  });

  // Rapor state
  const [ozet, setOzet] = useState(null);
  const [satislar, setSatislar] = useState([]);
  const [iptallar, setIptallar] = useState([]);
  const [raporYukleniyor, setRaporYukleniyor] = useState(false);

  useEffect(() => {
    if (aktifTab === "raporlar") {
      raporlariYukle();
    }
  }, [aktifTab]);

  const raporlariYukle = async () => {
    setRaporYukleniyor(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [ozetRes, satisRes, iptalRes] = await Promise.all([
        fetch(`${API_URL}/Rapor/genel-ozet`, { headers }),
        fetch(`${API_URL}/Rapor/etkinlik-satis`, { headers }),
        fetch(`${API_URL}/Rapor/iptal-etkinlikler`, { headers }),
      ]);
      setOzet(await ozetRes.json());
      setSatislar(await satisRes.json());
      setIptallar(await iptalRes.json());
    } catch (err) {
      console.error("Raporlar yüklenemedi:", err);
    } finally {
      setRaporYukleniyor(false);
    }
  };

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

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(formData);
    } else {
      addEvent(formData);
    }
    closeForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", padding: "48px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                <ArrowLeft size={24} />
              </Link>
              <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Yönetim Paneli</h1>
            </div>
            <p style={{ margin: 0, color: "var(--text-muted)", paddingLeft: "40px" }}>Platformdaki tüm etkinlikleri buradan yönetebilirsiniz.</p>
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
          }}>
            Etkinlikler
          </button>
          <button onClick={() => setAktifTab("raporlar")} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600,
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: aktifTab === "raporlar" ? "var(--primary)" : "rgba(255,255,255,0.08)",
            color: aktifTab === "raporlar" ? "white" : "var(--text-muted)"
          }}>
            <BarChart2 size={18} /> Raporlar
          </button>
        </div>

        {/* ETKİNLİKLER TABLOSU */}
        {aktifTab === "etkinlikler" && (
          <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500 }}>Etkinlik</th>
                  <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500 }}>Kategori / Mekan</th>
                  <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500 }}>Tarih</th>
                  <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500 }}>Fiyat</th>
                  <th style={{ padding: "16px 24px", color: "var(--text-muted)", fontWeight: 500, textAlign: "right" }}>İşlemler</th>
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
            {events.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Henüz hiç etkinlik eklenmemiş.</div>}
          </div>
        )}

        {/* RAPORLAR */}
        {aktifTab === "raporlar" && (
          <div>
            {raporYukleniyor ? (
              <div style={{ textAlign: "center", padding: "64px", color: "var(--text-muted)" }}>Yükleniyor...</div>
            ) : (
              <>
                {/* Genel Özet Kartları */}
                {ozet && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                    {[
                      { label: "Toplam Etkinlik", value: ozet.toplamEtkinlik, renk: "#4361ee" },
                      { label: "Aktif Etkinlik", value: ozet.aktifEtkinlik, renk: "#2dc653" },
                      { label: "İptal Etkinlik", value: ozet.iptalEtkinlik, renk: "#e63946" },
                      { label: "Toplam Bilet", value: ozet.toplamBilet, renk: "#f4a261" },
                      { label: "Toplam Gelir", value: `${ozet.toplamGelir?.toLocaleString("tr-TR")} ₺`, renk: "#7b2d8b" },
                      { label: "İade Bilet", value: ozet.iadeBilet, renk: "#f59e0b" },
                      { label: "Toplam Kullanıcı", value: ozet.toplamKullanici, renk: "#6c757d" },
                      
                    ].map((kart, i) => (
                      <div key={i} style={{ backgroundColor: kart.renk, borderRadius: "12px", padding: "24px", color: "white", textAlign: "center" }}>
                        <div style={{ fontSize: "13px", marginBottom: "8px", opacity: 0.9 }}>{kart.label}</div>
                        <div style={{ fontSize: "28px", fontWeight: 700 }}>{kart.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Etkinlik Satış Tablosu */}
                <h3 style={{ marginBottom: "16px" }}>Etkinlik Bazlı Satışlar</h3>
                <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden", marginBottom: "32px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                        {["Etkinlik", "Mekan", "Tarih", "Durum", "Toplam Koltuk", "Satılan", "Satış Oranı", "Gelir"].map(h => (
                          <th key={h} style={{ padding: "14px 20px", color: "var(--text-muted)", fontWeight: 500, textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {satislar.length === 0 ? (
                        <tr><td colSpan="8" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Henüz veri yok</td></tr>
                      ) : satislar.map(e => (
                        <tr key={e.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "14px 20px", fontWeight: 600 }}>{e.ad}</td>
                          <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{e.mekan}</td>
                          <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{new Date(e.tarih).toLocaleDateString("tr-TR")}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                              backgroundColor: e.durum === "aktif" ? "#d4edda" : "#f8d7da",
                              color: e.durum === "aktif" ? "#155724" : "#721c24" }}>
                              {e.durum}
                            </span>
                          </td>
                          <td style={{ padding: "14px 20px" }}>{e.toplamKoltuk}</td>
                          <td style={{ padding: "14px 20px" }}>{e.satirlanKoltuk}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "60px", height: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                                <div style={{ width: `${e.satisOrani}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "3px" }} />
                              </div>
                              <span style={{ fontSize: "13px" }}>%{e.satisOrani?.toFixed(1)}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontWeight: 600, color: "var(--primary)" }}>{e.toplamGelir?.toLocaleString("tr-TR")} ₺</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* İptal Edilen Etkinlikler */}
                <h3 style={{ marginBottom: "16px" }}>İptal Edilen Etkinlikler</h3>
                <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                        {["Etkinlik", "Mekan", "Tarih", "İptal Bilet Sayısı", "Toplam Kayıp"].map(h => (
                          <th key={h} style={{ padding: "14px 20px", color: "var(--text-muted)", fontWeight: 500, textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {iptallar.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>İptal edilmiş etkinlik yok</td></tr>
                      ) : iptallar.map(e => (
                        <tr key={e.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "14px 20px", fontWeight: 600 }}>{e.ad}</td>
                          <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{e.mekan}</td>
                          <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>{new Date(e.tarih).toLocaleDateString("tr-TR")}</td>
                          <td style={{ padding: "14px 20px" }}>{e.iptalBiletSayisi}</td>
                          <td style={{ padding: "14px 20px", fontWeight: 600, color: "#e63946" }}>{e.toplamKayip?.toLocaleString("tr-TR")} ₺</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
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
                <button onClick={closeForm} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
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

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-dark)", color: "var(--text-main)", outline: "none", boxSizing: "border-box"
};

const labelStyle = {
  display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px"
};

export default AdminDashboard;