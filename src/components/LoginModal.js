import { X } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function LoginModal({ isOpen, onClose }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sahte giriş: E-postadan ismi çıkar veya Demo yaz
    const name = email ? email.split("@")[0] : "Demo Kullanıcı";
    login(name, email);
    onClose();
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
          <h2 style={{ margin: 0, fontSize: "20px" }}>Giriş Yap</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}><X size={24} /></button>
        </div>

        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.5 }}>
            BiletBul platformuna hoş geldiniz. Sunum amaçlıdır, dilediğiniz bir e-posta ile anında giriş yapabilirsiniz.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>E-posta Adresi</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="ornek@mail.com" style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px" }}>Şifre</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" style={inputStyle} 
              />
            </div>

            <button type="submit" style={{
              padding: "14px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px",
              fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "8px"
            }}>
              Giriş Yap
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
