import { useState } from "react";
import Modal from "../ui/Modal";

/**
 * LoginModal
 * Simple email/password form that talks to the backend /api/auth/login
 * and returns a JWT token on success.
 */
export default function LoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState("amir@scaleready.ca");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("scaleready_token", data.token);
      }

      onSuccess?.(data.token, email);
      setLoading(false);
      onClose?.();
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Could not reach the server. Is the backend running on port 5000?");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Log in to ScaleReady">
      <form onSubmit={handleSubmit} className="login-form">
        <label className="field-label">
          Email
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="field-label">
          Password
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>

      <style>{`
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--gray-700);
          font-weight: 500;
        }

        .error-text {
          color: #b91c1c;
          font-size: 0.875rem;
        }
      `}</style>
    </Modal>
  );
}

