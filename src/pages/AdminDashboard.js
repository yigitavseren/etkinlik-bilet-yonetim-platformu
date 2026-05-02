import { useContext, useState } from "react";
import { EventContext } from "../context/EventContext";
import { Pencil, Trash2, Plus, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const { events, addEvent, updateEvent, deleteEvent } = useContext(EventContext);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "konser", artist: "", price: "", venue: "", date: "", time: "21:00", image: "", description: ""
  });

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
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", padding: "48px 32px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none", display: "flex", alignItems: "center" }}>
                <ArrowLeft size={24} />
              </Link>
              <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Yönetim Paneli</h1>
            </div>
            <p style={{ margin: 0, color: "var(--text-muted)", paddingLeft: "40px" }}>Platformdaki tüm etkinlikleri buradan yönetebilirsiniz.</p>
          </div>
          <button onClick={openAddForm} style={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "var(--primary)", color: "white",
            border: "none", padding: "12px 24px", borderRadius: "8px",
            fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "0.2s"
          }} onMouseEnter={(e) => e.target.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.target.style.backgroundColor = "var(--primary)"}>
            <Plus size={20} /> Yeni Etkinlik Ekle
          </button>
        </div>

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
                  <td style={{ padding: "16px 24px", color: "var(--text-muted)" }}>{event.date} <br/> <span style={{ fontSize: "12px" }}>{event.time}</span></td>
                  <td style={{ padding: "16px 24px", fontWeight: 600, color: "var(--primary)" }}>{event.price} ₺</td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button onClick={() => openEditForm(event)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginRight: "16px", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="white"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted)"}><Pencil size={18} /></button>
                    <button onClick={() => deleteEvent(event.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="#f87171"} onMouseLeave={(e) => e.currentTarget.style.color="#ef4444"}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Henüz hiç etkinlik eklenmemiş.</div>}
        </div>

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
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Etkinlik Adı</label>
                    <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Sanatçı</label>
                    <input required name="artist" value={formData.artist} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Kategori</label>
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
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Fiyat (₺)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Mekan</label>
                    <input required name="venue" value={formData.venue} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Tarih</label>
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Saat</label>
                    <input required type="time" name="time" value={formData.time} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Resim URL'si</label>
                  <input required name="image" value={formData.image} onChange={handleChange} placeholder="https://resimlinki.com/foto.jpg" style={inputStyle} />
                  {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: "12px", width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }} />}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Açıklama</label>
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

export default AdminDashboard;
