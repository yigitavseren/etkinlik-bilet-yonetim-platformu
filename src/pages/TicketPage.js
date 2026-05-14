import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, CreditCard, Clock, Armchair } from "lucide-react";
import { EventContext } from "../context/EventContext";
import { AuthContext } from "../context/AuthContext";
import SeatMapModal from "../components/SeatMapModal";
import CheckoutModal from "../components/CheckoutModal";
import LoginModal from "../components/LoginModal";

// ─── Bilet Türü Seçici ───────────────────────────────────────
function BiletTuruSecici({ etkinlikFiyati, secilenTur, onSec, user }) {
  const [turler, setTurler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5196/api/bilet/turler")
      .then((r) => r.json())
      .then((data) => {
        setTurler(data);
        const standart = data.find((t) => t.slug === "standart");
        if (standart && !secilenTur) onSec(standart);
      })
      .catch(() => setTurler([]))
      .finally(() => setYukleniyor(false));
  }, []);

  if (yukleniyor) {
    return (
      <div style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "14px" }}>
        Bilet türleri yükleniyor…
      </div>
    );
  }

  if (turler.length === 0) return null;

  function hexRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // İndirimli tür için öğrenci mail kontrolü
  function handleTurSec(tur) {
    if (tur.slug === "indirimli") {
      const mail = user?.email || "";
      if (!mail.endsWith(".edu.tr") && !mail.endsWith(".edu")) {
        alert("İndirimli bilet yalnızca öğrenci e-postası (.edu.tr veya .edu) olan kullanıcılara açıktır.");
        return;
      }
    }
    onSec(tur);
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "14px", marginBottom: "10px" }}>
        Bilet Türü
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {turler.map((tur) => {
          const aktif = secilenTur?.id === tur.id;
          const nihaiFiyat = (etkinlikFiyati * tur.fiyatCarpani).toFixed(2);
          const indirimliVeYetkisiz =
            tur.slug === "indirimli" &&
            !( (user?.email || "").endsWith(".edu.tr") || (user?.email || "").endsWith(".edu") );

          return (
            <button
              key={tur.id}
              onClick={() => handleTurSec(tur)}
              disabled={indirimliVeYetkisiz}
              title={indirimliVeYetkisiz ? "Yalnızca öğrenci e-postasıyla (.edu.tr / .edu) seçilebilir" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "10px",
                border: aktif
                  ? `2px solid ${tur.renkHex}`
                  : "1px solid var(--border-color)",
                background: indirimliVeYetkisiz
                  ? "var(--bg-dark)"
                  : aktif
                  ? hexRgba(tur.renkHex, 0.1)
                  : "var(--bg-dark)",
                cursor: indirimliVeYetkisiz ? "not-allowed" : "pointer",
                opacity: indirimliVeYetkisiz ? 0.45 : 1,
                transition: "all 0.15s",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: tur.renkHex,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: aktif ? tur.renkHex : "var(--text-main)" }}>
                    {tur.ad}
                    {indirimliVeYetkisiz && (
                      <span style={{ marginLeft: "6px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
                        (Öğrenci e-postası gerekli)
                      </span>
                    )}
                  </div>
                  {tur.avantajlar?.length > 0 && (
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {tur.avantajlar.slice(0, 2).join(" · ")}
                      {tur.avantajlar.length > 2 && " …"}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: tur.renkHex, whiteSpace: "nowrap", marginLeft: "8px" }}>
                ₺{parseFloat(nihaiFiyat).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── TicketPage ──────────────────────────────────────────────
function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const { user } = useContext(AuthContext);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [secilenTur, setSecilenTur] = useState(null);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-main)", backgroundColor: "var(--bg-dark)" }}>
        <h2>Etkinlik bulunamadı.</h2>
        <button onClick={() => navigate("/")} style={{ marginLeft: "16px", padding: "8px 16px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Geri Dön</button>
      </div>
    );
  }

  const handleOpenCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Lütfen önce koltuk seçiniz.");
      return;
    }
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (user.role === "admin" || user.role === "organizer") {
      alert("Yönetici hesabıyla bilet satın alınamaz.");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const birimFiyat = secilenTur
    ? parseFloat((event.price * secilenTur.fiyatCarpani).toFixed(2))
    : event.price;

  const totalPrice = parseFloat((birimFiyat * selectedSeats.length).toFixed(2));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)", paddingBottom: "64px" }}>

      {/* HERO */}
      <div style={{ position: "relative", height: "400px", width: "100%", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${event.image})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(10px)", opacity: 0.4, transform: "scale(1.1)"
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, var(--bg-dark) 0%, transparent 100%)"
        }} />
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", height: "100%", display: "flex", alignItems: "flex-end", padding: "32px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              position: "absolute", top: "32px", left: "32px",
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px 20px", borderRadius: "999px", cursor: "pointer", backdropFilter: "blur(4px)"
            }}
          >
            <ArrowLeft size={18} /> Ana Sayfaya Dön
          </button>
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-end" }}>
            <img src={event.image} alt={event.name} style={{ width: "240px", height: "320px", objectFit: "cover", borderRadius: "16px", boxShadow: "var(--shadow-lg)", border: "2px solid var(--border-color)" }} />
            <div style={{ paddingBottom: "16px" }}>
              <div style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "var(--primary)", color: "white", borderRadius: "999px", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", marginBottom: "16px" }}>
                {event.category}
              </div>
              <h1 style={{ fontSize: "48px", fontWeight: 800, margin: "0 0 16px 0", color: "white", lineHeight: 1.1 }}>{event.name}</h1>
              <p style={{ fontSize: "20px", color: "var(--text-muted)", margin: 0 }}>Sanatçı: <span style={{ color: "white" }}>{event.artist}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* İÇERİK */}
      <div style={{ maxWidth: "1200px", margin: "48px auto 0", padding: "0 32px", display: "flex", gap: "48px", alignItems: "flex-start" }}>

        {/* SOL */}
        <div style={{ flex: 2 }}>
          <h3 style={{ fontSize: "24px", margin: "0 0 24px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>Etkinlik Detayları</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: "var(--bg-card)", padding: "20px", borderRadius: "12px" }}>
              <Calendar color="var(--primary)" size={24} />
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>Tarih</div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>{event.date}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: "var(--bg-card)", padding: "20px", borderRadius: "12px" }}>
              <Clock color="var(--primary)" size={24} />
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>Saat</div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>{event.time}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: "var(--bg-card)", padding: "20px", borderRadius: "12px", gridColumn: "span 2" }}>
              <MapPin color="var(--primary)" size={24} />
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>Mekan</div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>{event.venue}</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "24px", margin: "0 0 16px 0" }}>Açıklama</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "16px", whiteSpace: "pre-line" }}>
            {event.description}
          </p>

          {/* Benzer Etkinlikler */}
          {(() => {
            const benzerler = events.filter(e => e.category === event.category && e.id !== event.id).slice(0, 3);
            if (benzerler.length === 0) return null;
            return (
              <div style={{ marginTop: "48px" }}>
                <h3 style={{ fontSize: "24px", margin: "0 0 24px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>Benzer Etkinlikler</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  {benzerler.map(e => (
                    <div key={e.id} onClick={() => navigate(`/bilet/${e.id}`)}
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
                      onMouseEnter={el => el.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={el => el.currentTarget.style.transform = "translateY(0)"}
                    >
                      <img src={e.image} alt={e.name} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                      <div style={{ padding: "12px" }}>
                        <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>{e.category}</div>
                        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{e.name}</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>{e.venue}</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>{e.price} ₺</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* SAĞ: SATIN ALMA KARTI */}
        <div style={{ flex: 1, backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "32px", position: "sticky", top: "100px" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "24px" }}>Bilet Al</h3>

          {/* Taban fiyat */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
            <span style={{ color: "var(--text-muted)" }}>Taban Fiyat</span>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-muted)" }}>{event.price} ₺</span>
          </div>

          {/* BİLET TÜRÜ SEÇİCİ */}
          <BiletTuruSecici
            etkinlikFiyati={event.price}
            secilenTur={secilenTur}
            onSec={setSecilenTur}
            user={user}
          />

          {/* Koltuk seçimi */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-muted)" }}>
              <span>Seçili Koltuklar</span>
              <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{selectedSeats.length} Adet</span>
            </label>

            {selectedSeats.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {selectedSeats.map(seatId => (
                  <div key={seatId} style={{ padding: "6px 12px", backgroundColor: "rgba(244, 63, 94, 0.1)", color: "var(--primary)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "6px", fontSize: "14px", fontWeight: 600 }}>
                    {seatId}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "16px", border: "1px dashed var(--border-color)", borderRadius: "8px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
                Henüz koltuk seçmediniz.
              </div>
            )}

            <button
              onClick={() => setIsSeatMapOpen(true)}
              style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-dark)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "16px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }}
              onMouseEnter={(e) => e.target.style.borderColor = "var(--primary)"}
              onMouseLeave={(e) => e.target.style.borderColor = "var(--border-color)"}
            >
              <Armchair size={18} /> {selectedSeats.length > 0 ? "Koltukları Değiştir" : "Koltuk Seç"}
            </button>
          </div>

          {/* Toplam */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "16px", backgroundColor: "rgba(244, 63, 94, 0.1)", borderRadius: "8px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
            <div>
              <div style={{ fontWeight: 500, color: "var(--primary)", marginBottom: "2px" }}>Toplam Tutar</div>
              {secilenTur && secilenTur.slug !== "standart" && (
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {selectedSeats.length} koltuk × ₺{birimFiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </div>
              )}
            </div>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary)" }}>
              {totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </span>
          </div>

          <button
            onClick={handleOpenCheckout}
            disabled={selectedSeats.length === 0}
            style={{
              width: "100%", padding: "16px",
              backgroundColor: selectedSeats.length === 0 ? "var(--bg-dark)" : "var(--primary)",
              color: selectedSeats.length === 0 ? "var(--text-muted)" : "white",
              border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: 600,
              cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s"
            }}
          >
            <CreditCard /> {selectedSeats.length === 0 ? "Koltuk Seçiniz" : "Güvenli Ödeme Yap"}
          </button>
        </div>
      </div>

      {/* MODALLER */}
      <SeatMapModal
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        event={event}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        event={event}
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        birimFiyat={birimFiyat}
        secilenTur={secilenTur}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

export default TicketPage;