/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

  useEffect(() => {
    // If already logged in, redirect to leads dashboard
    if (typeof window !== "undefined" && sessionStorage.getItem("jwt")) {
      router.push("/admin/leads");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password: password }),
      });

      const data = await res.json();

      if (res.ok && data.jwt) {
        // Save JWT to Session Storage
        sessionStorage.setItem("jwt", data.jwt);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/leads");
        }, 500);
      } else {
        throw new Error(data.error?.message || "Gagal login, periksa kembali kredensial Anda.");
      }
    } catch (err: any) {
      setError(err.message === "Failed to fetch" ? "Gagal terhubung ke server. Pastikan Backend (Strapi) berjalan." : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/logo-dengarkan-listening-tools.png" alt="dengarkan.id" />
            <h1>Admin Portal</h1>
            <p>Silakan masuk menggunakan akun admin Anda</p>
          </div>

          {error && (
            <div id="error-alert" className="alert alert-error" style={{ display: "flex" }}>
              <i className="ph ph-warning-circle"></i>
              <span id="error-message">{error}</span>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <div className="form-input-wrapper">
                <i className="ph ph-envelope"></i>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="admin@dengarkan.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <i className="ph ph-lock-key"></i>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-login"
              id="submit-btn"
              disabled={loading || success}
              style={success ? { background: "#10B981" } : {}}
            >
              {loading ? (
                <>
                  <i className="ph ph-spinner ph-spin"></i> Memproses...
                </>
              ) : success ? (
                <>
                  <i className="ph ph-check-circle"></i> Berhasil Masuk
                </>
              ) : (
                <>
                  Masuk ke Dashboard <i className="ph ph-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        </div>
        <Link href="/" className="back-link">
          <i className="ph ph-arrow-left"></i> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
