import { X } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function LoginModal({ isOpen, onClose }) {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    let sonuc;
    if (isRegister) {
      sonuc = await register(name, email, password);
    } else {
      sonuc = await login(email, password);
    }

    setYukleniyor(false);

    if (sonuc?.basarili === false) {
      setHata(sonuc.hata || "Bir hata oluştu.");
    } else {
      onClose();
      setEmail("");
      setPassword("");
      setName("");
      setHata("");
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
        maxWidth: "400px",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}><X size={24} /></button>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
          <button onClick={() => { setIsRegister(false); setHata(""); }}
            style={{ flex: 1, padding: "12px", background: "none", border: "none",
              borderBottom: !isRegister ? "2px solid var(--primary)" : "2px solid transparent",
              color: !isRegister ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            Giriş Yap
          </button>
          <button onClick={() => { setIsRegister(true); setHata(""); }}
            style={{ flex: 1, padding: "12px", background: "none", border: "none",
              borderBottom: isRegister ? "2px solid var(--primary)" : "2px solid transparent",
              color: isRegister ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            Kayıt Ol
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {hata && (
            <div style={{
              background: "#f8d7da", color: "#721c24", padding: "10px 14px",
              borderRadius: "8px", marginBottom: "16px", fontSize: "14px"
            }}>
              {hata}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {isRegister && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Ad Soyad</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ad Soyad" style={inputStyle} />
              </div>
            )}
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>E-posta Adresi</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Şifre</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <button type="submit" disabled={yukleniyor} style={{
              padding: "14px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px",
              fontSize: "16px", fontWeight: 600, cursor: yukleniyor ? "not-allowed" : "pointer",
              marginTop: "8px", opacity: yukleniyor ? 0.7 : 1
            }}>
              {yukleniyor ? "Bekleyin..." : isRegister ? "Hesap Oluştur" : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-dark)", color: "var(--text-main)", outline: "none", boxSizing: "border-box"
};

export default LoginModal;