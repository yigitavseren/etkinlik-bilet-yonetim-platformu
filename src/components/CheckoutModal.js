import { X, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// birimFiyat ve secilenTur prop olarak geliyor (TicketPage'den)
function CheckoutModal({ isOpen, onClose, event, selectedSeats, totalPrice, birimFiyat, secilenTur }) {
  const navigate = useNavigate();
  const { addTicket } = useContext(AuthContext);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(15);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(15);
    setTimeExpired(false);
    setPaymentStatus("idle");

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setTimeExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCardNumber = (val) => val.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  const formatExpiry = (val) => val.replace(/\//g, "").replace(/(\d{2})/, "$1/").substring(0, 5);

  const handlePay = async (e) => {
    e.preventDefault();
    if (timeExpired) return;
    setPaymentStatus("processing");

    try {
      const user = JSON.parse(localStorage.getItem("biletbul_user"));
      const token = user?.token;
      const refCode = "BLT-" + Math.floor(100000 + Math.random() * 900000);

      for (const seat of selectedSeats) {
        await fetch("http://localhost:5196/api/Bilet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kullaniciId: user.id,
            etkinlikId: event.id,
            koltukNo: seat,
            // YENİ: bilet türü bilgileri
            biletTuruId: secilenTur?.id ?? null,
            tabanFiyat: event.price,               // etkinliğin taban fiyatı (snapshot)
            fiyat: birimFiyat ?? event.price,       // tür çarpanı uygulanmış birim fiyat
            durum: "aktif",
          }),
        });
      }

      setPaymentStatus("success");

      addTicket({
        id: Date.now(),
        refCode,
        eventName: event.name,
        artist: event.artist,
        category: event.category,
        date: event.date,
        time: event.time,
        venue: event.venue,
        seats: selectedSeats,
        price: totalPrice,
        biletTuru: secilenTur?.ad ?? "Standart",   // profil sayfasında göstermek için
      });

      setTimeout(() => { onClose(); navigate("/profile"); }, 2000);

    } catch (err) {
      console.error("Ödeme hatası:", err);
      setPaymentStatus("idle");
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px"
    }}>
      <div style={{
        backgroundColor: "var(--bg-card)", borderRadius: "20px", width: "100%", maxWidth: "500px",
        border: "1px solid var(--border-color)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        overflow: "hidden", position: "relative"
      }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CreditCard color="var(--primary)" /> Güvenli Ödeme
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {paymentStatus === "idle" && !timeExpired && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: timeLeft <= 5 ? "#ef4444" : "var(--text-muted)", fontWeight: 600, fontSize: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: `3px solid ${timeLeft <= 5 ? "#ef4444" : "var(--primary)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: timeLeft <= 5 ? "#ef4444" : "var(--primary)" }}>
                  {timeLeft}
                </div>
                saniye
              </div>
            )}
            {paymentStatus === "idle" && (
              <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* SÜRE DOLDU */}
        {paymentStatus === "idle" && timeExpired && (
          <div style={{ padding: "64px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <X size={48} color="#ef4444" />
            </div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#ef4444" }}>Süre Doldu!</h3>
            <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", textAlign: "center" }}>Ödeme süresi doldu. Lütfen tekrar deneyin.</p>
            <button onClick={onClose} style={{ padding: "12px 32px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>Kapat</button>
          </div>
        )}

        {/* ÖDEME FORMU */}
        {paymentStatus === "idle" && !timeExpired && (
          <div style={{ padding: "32px" }}>

            {/* Seçilen tür özeti */}
            {secilenTur && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: "8px", marginBottom: "20px",
                border: `1px solid ${secilenTur.renkHex}`,
                background: `rgba(${parseInt(secilenTur.renkHex.slice(1,3),16)},${parseInt(secilenTur.renkHex.slice(3,5),16)},${parseInt(secilenTur.renkHex.slice(5,7),16)},0.08)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: secilenTur.renkHex, display: "inline-block" }} />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: secilenTur.renkHex }}>{secilenTur.ad} Bilet</span>
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {selectedSeats.length} × ₺{(birimFiyat ?? event.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* SANAL KART */}
            <div style={{
              width: "100%", height: "220px", borderRadius: "16px", marginBottom: "32px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%)",
              boxShadow: "0 10px 25px -5px rgba(67,56,202,0.5)",
              padding: "24px", boxSizing: "border-box", position: "relative",
              color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
              <div style={{ position: "absolute", left: "-50px", bottom: "-50px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, fontStyle: "italic", letterSpacing: "1px" }}>BiletBul</div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.8)", mixBlendMode: "screen" }} />
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "rgba(245,158,11,0.8)", mixBlendMode: "screen", marginLeft: "-15px" }} />
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Kart Numarası</div>
                <div style={{ fontSize: "22px", letterSpacing: "3px", fontFamily: "monospace", minHeight: "26px" }}>{cardNumber || "•••• •••• •••• ••••"}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Kart Sahibi</div>
                  <div style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", minHeight: "20px" }}>{cardName || "İSİM SOYİSİM"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>SKT</div>
                  <div style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "1px", fontFamily: "monospace", minHeight: "20px" }}>{expiry || "AA/YY"}</div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Kart Sahibinin Adı</label>
                <input required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Tarkan Tevetoğlu" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Kart Numarası</label>
                <input required value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="4321 0000 0000 0000" maxLength={19} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Son Kullanma Tarihi</label>
                  <input required value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="12/26" maxLength={5} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>CVV</label>
                  <input required value={cvv} onChange={(e) => setCvv(e.target.value)} type="password" placeholder="•••" maxLength={4} style={inputStyle} />
                </div>
              </div>
              <button type="submit" style={{
                padding: "16px", backgroundColor: "var(--primary)", color: "white", border: "none",
                borderRadius: "12px", fontSize: "18px", fontWeight: 600, cursor: "pointer",
                marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span>Onayla ve Öde</span>
                <span>{totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</span>
              </button>
            </form>
          </div>
        )}

        {/* PROCESSING */}
        {paymentStatus === "processing" && (
          <div style={{ padding: "64px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <Loader2 size={64} color="var(--primary)" style={{ animation: "spin 1s linear infinite", marginBottom: "24px" }} />
            <h3 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>Ödeme İşleniyor...</h3>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Lütfen sayfayı kapatmayın.</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* SUCCESS */}
        {paymentStatus === "success" && (
          <div style={{ padding: "64px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              <CheckCircle2 size={48} color="#10b981" />
            </div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#10b981" }}>Ödeme Başarılı!</h3>
            <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", textAlign: "center" }}>
              Biletleriniz oluşturuldu.<br />Biletlerim sayfasına yönlendiriliyorsunuz...
            </p>
            <div style={{ width: "100%", padding: "16px", backgroundColor: "var(--bg-dark)", borderRadius: "12px", border: "1px dashed var(--border-color)", textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 600, letterSpacing: "2px", color: "var(--primary)" }}>✓ Biletleriniz profilinize eklendi</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-dark)", color: "var(--text-main)", outline: "none",
  boxSizing: "border-box", fontSize: "16px", fontFamily: "inherit"
};

export default CheckoutModal;