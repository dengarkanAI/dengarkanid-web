/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: number;
  attributes?: {
    name: string;
    email: string;
    company?: string;
    jobTitle?: string;
    source?: string;
    createdAt?: string;
  };
  // Fallback for flat structure
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  createdAt?: string;
}

export default function Page() {
  const router = useRouter();
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  const [token, setToken] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Check auth on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("jwt");
      const userStr = sessionStorage.getItem("user");

      if (!storedToken) {
        router.push("/admin/login");
      } else {
        setToken(storedToken);
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setAdminName(user.username || user.email || "Admin");
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [router]);

  // Fetch leads once token is available
  useEffect(() => {
    if (token) {
      fetchLeads(token);
    }
  }, [token]);

  const fetchLeads = async (jwtToken: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/leads?sort=createdAt:desc`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }

      const json = await res.json();
      setAllLeads(json.data || []);
    } catch (err: any) {
      console.error("Failed to fetch leads:", err);
      setError(err.message || "Gagal memuat data leads.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("user");
    router.push("/admin/login");
  };

  const handleRefresh = () => {
    if (token) {
      fetchLeads(token);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (allLeads.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    let csv = "Name,Email,Company,Job Title,Source,Date\n";
    allLeads.forEach((item) => {
      const lead = item.attributes || item;
      const row = [
        `"${lead.name || ""}"`,
        `"${lead.email || ""}"`,
        `"${lead.company || ""}"`,
        `"${lead.jobTitle || ""}"`,
        `"${lead.source || "Website"}"`,
        `"${new Date(lead.createdAt || "").toISOString()}"`,
      ].join(",");
      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "leads_dengarkan.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter leads based on search query
  const getFilteredLeads = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allLeads;

    return allLeads.filter((item) => {
      const lead = item.attributes || item;
      return (
        (lead.name || "").toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.company || "").toLowerCase().includes(q)
      );
    });
  };

  // Calculate statistics
  const getStats = () => {
    const total = allLeads.length;
    const companies = new Set<string>();
    let thisMonth = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    allLeads.forEach((item) => {
      const lead = item.attributes || item;
      if (lead.company) {
        companies.add(lead.company.toLowerCase().trim());
      }

      if (lead.createdAt) {
        const d = new Date(lead.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          thisMonth++;
        }
      }
    });

    return {
      total,
      companiesCount: companies.size,
      thisMonthCount: thisMonth,
    };
  };

  const stats = getStats();
  const filteredLeads = getFilteredLeads();

  // If token is checking / not present yet, show a clean initial layout or spinner
  if (!token) {
    return (
      <div className="leads-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="loading-state">
          <i className="ph ph-spinner-gap"></i>
          <p>Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-page">
      {/*  Admin Navbar  */}
      <nav className="admin-nav">
        <div className="logo">
          <img src="/logo-dengarkan-listening-tools.png" alt="dengarkan.id" />
        </div>
        <div className="admin-user">
          <div className="user-info">
            <div className="user-name" id="admin-name">
              {adminName}
            </div>
            <div className="user-role">Super Administrator</div>
          </div>
          <button className="btn-logout" id="logout-btn" onClick={handleLogout}>
            <i className="ph ph-sign-out"></i> Keluar
          </button>
        </div>
      </nav>

      {/*  Main Content  */}
      <main className="dashboard-container">
        <div className="header-row">
          <div className="page-title">
            <h1>Leads Dashboard</h1>
            <p>Kelola data pendaftaran (leads) yang masuk dari website.</p>
          </div>
          <div className="header-actions">
            <button className="btn-action" id="refresh-btn" onClick={handleRefresh}>
              <i className="ph ph-arrows-clockwise"></i> Refresh
            </button>
            <button className="btn-action btn-primary" id="export-btn" onClick={handleExportCSV}>
              <i className="ph ph-download-simple"></i> Export CSV
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">
              <i className="ph ph-users" style={{ color: "#0F62FE" }}></i> Total Leads
            </div>
            <div className="stat-value" id="total-count">
              {stats.total}
            </div>
            <div className="stat-trend">
              <i className="ph ph-trend-up"></i> Seluruh waktu
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">
              <i className="ph ph-buildings" style={{ color: "#8B5CF6" }}></i> Perusahaan Unik
            </div>
            <div className="stat-value" id="company-count">
              {stats.companiesCount}
            </div>
            <div className="stat-trend">
              <i className="ph ph-trend-up"></i> Dari berbagai industri
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">
              <i className="ph ph-calendar-check" style={{ color: "#10B981" }}></i> Lead Bulan Ini
            </div>
            <div className="stat-value" id="month-count">
              {stats.thisMonthCount}
            </div>
            <div className="stat-trend">
              <i className="ph ph-trend-up"></i> Pertumbuhan aktif
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="search-box">
              <i className="ph ph-magnifying-glass"></i>
              <input
                type="text"
                id="search-input"
                placeholder="Cari nama, email, atau perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="pagination-info" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>
              Menampilkan <span id="display-count">{filteredLeads.length}</span> leads
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="loading-state" id="loading">
                <i className="ph ph-spinner-gap"></i>
                <p>Memuat data leads...</p>
              </div>
            ) : error ? (
              <div className="empty-state" id="empty-state" style={{ display: "block" }}>
                <p style={{ color: "#dc2626" }}>Gagal memuat data: {error}. Pastikan Backend Strapi berjalan.</p>
                <button className="btn-action" onClick={handleRefresh} style={{ marginTop: "16px", display: "inline-flex" }}>
                  Coba Lagi
                </button>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="empty-state" id="empty-state" style={{ display: "block" }}>
                <h3>Belum ada data leads</h3>
                <p>Data akan muncul di sini setelah ada pendaftar dari website.</p>
              </div>
            ) : (
              <table id="leads-table">
                <thead>
                  <tr>
                    <th>Profil</th>
                    <th>Perusahaan & Jabatan</th>
                    <th>Sumber</th>
                    <th>Tanggal Masuk</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="table-body">
                  {filteredLeads.map((item) => {
                    const lead = item.attributes || item;
                    const initial = lead.name ? lead.name.charAt(0).toUpperCase() : "?";
                    const createdAtDate = lead.createdAt ? new Date(lead.createdAt) : new Date();
                    const dateFormatted = createdAtDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    // Check if created within last 24h
                    const isNew = new Date().getTime() - createdAtDate.getTime() < 24 * 60 * 60 * 1000;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar">{initial}</div>
                            <div className="user-details">
                              <strong>
                                {lead.name || "-"}{" "}
                                {isNew && <span className="badge badge-new">Baru</span>}
                              </strong>
                              <span>{lead.email || "-"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-details">
                            <strong>{lead.company || "-"}</strong>
                            <span>{lead.jobTitle || "-"}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-source">{lead.source || "Website"}</span>
                        </td>
                        <td className="date-cell">{dateFormatted}</td>
                        <td>
                          <a
                            href={`mailto:${lead.email}`}
                            className="btn-action"
                            style={{ display: "inline-flex", border: "none", background: "#f3f4f6", padding: "6px 10px" }}
                          >
                            <i className="ph ph-envelope-simple"></i> Email
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
