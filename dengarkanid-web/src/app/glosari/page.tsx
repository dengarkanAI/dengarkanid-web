/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const catLabelMap: Record<string, string> = {
  listening: 'Listening',
  analytics: 'Analytics',
  sentiment: 'Sentiment',
  social: 'Social',
  strategy: 'Strategy',
  metrics: 'Metrics'
};

interface TermData {
  l: string;
  t: string;
  e: string;
  c: string;
  d: string;
  r: string[];
}

export default function Glosari() {
  const [glossaryData, setGlossaryData] = useState<TermData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGlossaryData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const res = await fetch(`${apiUrl}/api/glosariums?pagination[limit]=100&sort=term:ASC`);
        const json = await res.json();
        
        const mappedData: TermData[] = json.data.map((item: any) => {
          const attrs = item.attributes || item;
          const t = attrs.term;
          const rList = attrs.relatedTerms ? attrs.relatedTerms.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          return {
            l: t.charAt(0).toUpperCase(),
            t: t,
            e: attrs.englishTerm || '',
            c: attrs.category,
            d: attrs.definition,
            r: rList
          };
        });
        
        mappedData.sort((a, b) => a.t.localeCompare(b.t));
        setGlossaryData(mappedData);
      } catch (err) {
        console.error('Error loading glossary data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGlossaryData();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = glossaryData;
    if (activeCat !== 'all') {
      filtered = filtered.filter(d => d.c === activeCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(d => 
        (d.t + d.e + d.d + (d.r || []).join(' ')).toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [glossaryData, searchQuery, activeCat]);

  const groupedData = useMemo(() => {
    const grouped: Record<string, TermData[]> = {};
    filteredData.forEach(item => {
      if (!grouped[item.l]) grouped[item.l] = [];
      grouped[item.l].push(item);
    });
    return grouped;
  }, [filteredData]);

  const usedLetters = useMemo(() => {
    return Array.from(new Set(glossaryData.map(d => d.l)));
  }, [glossaryData]);

  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = (l: string) => {
    const target = document.getElementById('group-' + l);
    if (target) {
      const yOffset = -100; 
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const getCatCount = (cat: string) => {
    return cat === 'all' ? glossaryData.length : glossaryData.filter(d => d.c === cat).length;
  };

  return (
    <>
      <Navbar />

      <section className="glosari-hero">
        <div className="glosari-hero-inner">
          <div className="glosari-eyebrow"><span className="dot"></span> Kamus Istilah Digital</div>
          <h1>Glosari <span className="highlight">Listening Tools</span></h1>
          <p>Pahami setiap istilah dalam dunia social media listening, brand monitoring, dan digital analytics. Dari A sampai Z — semua ada di sini.</p>
          <div className="glosari-stats">
            <div className="glosari-stat"><span className="num" id="total-terms">{loading ? '...' : glossaryData.length}</span><span className="lbl">Istilah</span></div>
            <div className="stat-div"></div>
            <div className="glosari-stat"><span className="num">6</span><span className="lbl">Kategori</span></div>
            <div className="stat-div"></div>
            <div className="glosari-stat"><span className="num">EN/ID</span><span className="lbl">Dwibahasa</span></div>
          </div>
        </div>
      </section>

      <div className="glosari-search-section">
        <div className="glosari-search-inner">
          <div className="search-box">
            <i className="ph ph-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Cari istilah: sentiment, reach, mention…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-count">Menampilkan <span>{filteredData.length}</span> istilah</div>
          <div className="alpha-nav" id="alpha-nav">
            {alphabets.map(l => (
              <button 
                key={l}
                className={`alpha-btn ${usedLetters.includes(l) ? 'has-terms' : ''}`}
                disabled={!usedLetters.includes(l)}
                onClick={() => handleLetterClick(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glosari-body">
        <aside className="glosari-sidebar">
          <p className="sidebar-title">Kategori</p>
          <ul className="sidebar-category-list">
            <li><button className={`sidebar-cat-btn ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}><span className="sidebar-cat-dot" style={{background: 'linear-gradient(135deg,#F9DBFF,#AAECFF)'}}></span>Semua Istilah<span className="cat-count">{getCatCount('all')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'listening' ? 'active' : ''}`} onClick={() => setActiveCat('listening')}><span className="sidebar-cat-dot" style={{background: '#8B5CF6'}}></span>Listening<span className="cat-count">{getCatCount('listening')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'analytics' ? 'active' : ''}`} onClick={() => setActiveCat('analytics')}><span className="sidebar-cat-dot" style={{background: '#0F62FE'}}></span>Analytics<span className="cat-count">{getCatCount('analytics')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'sentiment' ? 'active' : ''}`} onClick={() => setActiveCat('sentiment')}><span className="sidebar-cat-dot" style={{background: '#10B981'}}></span>Sentiment<span className="cat-count">{getCatCount('sentiment')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'social' ? 'active' : ''}`} onClick={() => setActiveCat('social')}><span className="sidebar-cat-dot" style={{background: '#EC4899'}}></span>Social Media<span className="cat-count">{getCatCount('social')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'strategy' ? 'active' : ''}`} onClick={() => setActiveCat('strategy')}><span className="sidebar-cat-dot" style={{background: '#F59E0B'}}></span>Strategy<span className="cat-count">{getCatCount('strategy')}</span></button></li>
            <li><button className={`sidebar-cat-btn ${activeCat === 'metrics' ? 'active' : ''}`} onClick={() => setActiveCat('metrics')}><span className="sidebar-cat-dot" style={{background: '#EF4444'}}></span>Metrics<span className="cat-count">{getCatCount('metrics')}</span></button></li>
          </ul>
        </aside>

        <main className="glosari-terms" id="terms-container">
          {filteredData.length === 0 && !loading ? (
            <div className="no-results" style={{display: 'block'}}>
              <i className="ph ph-magnifying-glass-minus"></i>
              <h3>Istilah tidak ditemukan</h3>
              <p>Coba kata kunci yang berbeda atau pilih kategori lain.</p>
            </div>
          ) : (
            Object.keys(groupedData).sort().map(letter => (
              <div key={letter} className="letter-group" id={`group-${letter}`}>
                <div className="letter-anchor">
                  <div className="letter-badge">{letter}</div>
                  <div className="letter-divider"></div>
                  <span className="letter-count">{groupedData[letter].length} istilah</span>
                </div>
                <div className="terms-grid">
                  {groupedData[letter].map(item => (
                    <div key={item.t} className="term-card">
                      <div className="term-header">
                        <div><span className="term-name">{item.t}</span><span className="term-en">{item.e}</span></div>
                        <span className={`term-badge badge-${item.c}`}>{catLabelMap[item.c]}</span>
                      </div>
                      <p className="term-definition">{item.d}</p>
                      {item.r && item.r.length > 0 && (
                        <div className="term-related">
                          <span className="related-label">Lihat juga:</span>
                          {item.r.map(r => (
                            <span key={r} className="related-tag">{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      <div className="glosari-cta-wrap">
        <div className="glosari-cta">
          <h2>Siap Mulai Social Listening?</h2>
          <p>Gunakan semua istilah ini langsung dalam platform dengarkan.id dan monitor brand Anda secara real-time.</p>
          <div className="glosari-cta-btns">
            <a href="#" className="btn-white"><i className="ph ph-rocket-launch"></i> Coba Gratis Sekarang</a>
            <a href="/artikel" className="btn-ghost-white"><i className="ph ph-article"></i> Baca Artikel</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
