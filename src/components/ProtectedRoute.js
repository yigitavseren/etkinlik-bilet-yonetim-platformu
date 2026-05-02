import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Giriş yapılmamışsa ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Yetkisi yoksa (örneğin admin değilse) ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
