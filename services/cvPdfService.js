import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { PROFILE_PHOTO_BASE64 } from '../assets/profileBase64';
import { portfolioService } from './portfolioService';
import { profileService } from './profileService';
import { scoreService } from './scoreService';

/**
 * Helper to escape HTML characters safely
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds the complete modern, executive 2-column CV HTML document
 * styled after the user's reference visual template.
 */
export function buildCvHtml({
  profile,
  score,
  skills = [],
  portfolio = [],
  experience = [],
  hobbies = [],
  photoBase64 = PROFILE_PHOTO_BASE64,
}) {
  const educationItems = experience.filter((e) => e.jenis === 'pendidikan');
  const orgItems = experience.filter((e) => e.jenis === 'organisasi');
  const achievementItems = experience.filter((e) => e.jenis === 'prestasi');

  // Flatten top skills for visual progress bars
  const skillList = [];
  skills.forEach((group) => {
    group.items.forEach((item) => {
      skillList.push({ ...item, group: group.kategori });
    });
  });
  // Sort or take notable skills
  const displaySkills = skillList.slice(0, 10);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Curriculum Vitae - ${escapeHtml(profile?.nama || 'Naelul Kirom Indalloh')}</title>
  <style>
    @page {
      size: A4;
      margin: 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.45;
      font-size: 11px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cv-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }

    /* Web Floating Action Bar (hidden on print) */
    .web-action-bar {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #102a43;
      color: #ffffff;
      padding: 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.18);
      margin-bottom: 14px;
      border-radius: 0 0 8px 8px;
    }
    .bar-title {
      font-size: 13px;
      font-weight: 700;
    }
    .bar-buttons {
      display: flex;
      gap: 8px;
    }
    .bar-btn {
      border: none;
      border-radius: 6px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-print {
      background: #f59e0b;
      color: #102a43;
    }
    .btn-close {
      background: #334155;
      color: #f1f5f9;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        padding: 0 !important;
        background: #ffffff !important;
      }
    }

    /* ── HEADER ───────────────────────────────────────────────────────── */
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 14px;
      position: relative;
    }
    .avatar-wrapper {
      position: relative;
      width: 110px;
      height: 110px;
      margin-right: 22px;
      flex-shrink: 0;
    }
    .avatar-ring {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 3.5px solid #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1e293b;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .header-text {
      flex: 1;
    }
    .header-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #102a43;
      margin-bottom: 3px;
    }
    .header-title {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-badge {
      display: inline-block;
      background-color: #e0e7ff;
      color: #3730a3;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 4px;
      letter-spacing: 0.3px;
    }

    /* Ribbon Contact Bar */
    .contact-ribbon {
      background: #102a43;
      color: #ffffff;
      border-radius: 30px;
      padding: 6px 16px;
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 5px rgba(16, 42, 67, 0.2);
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      font-size: 10px;
      font-weight: 500;
      color: #f1f5f9;
      text-decoration: none;
    }
    .contact-icon {
      margin-right: 5px;
      display: inline-block;
      width: 13px;
      height: 13px;
      vertical-align: middle;
      fill: #f59e0b;
    }

    /* ── TWO-COLUMN LAYOUT ────────────────────────────────────────────── */
    .body-columns {
      display: flex;
      gap: 18px;
      align-items: stretch;
    }

    /* ── LEFT COLUMN (Sidebar) ───────────────────────────────────────── */
    .col-left {
      width: 35%;
      background: #f0f4f8;
      border-radius: 8px;
      padding: 14px 14px 12px 14px;
      flex-shrink: 0;
    }
    .section-title-left {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #102a43;
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 2px solid #cbd5e1;
    }
    .about-text {
      font-size: 10px;
      color: #334155;
      text-align: justify;
      line-height: 1.45;
      margin-bottom: 14px;
    }

    /* Skill bars */
    .skills-group {
      margin-bottom: 14px;
    }
    .skill-item {
      margin-bottom: 7px;
    }
    .skill-info {
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }
    .skill-track {
      width: 100%;
      height: 6px;
      background-color: #cbd5e1;
      border-radius: 3px;
      overflow: hidden;
    }
    .skill-fill {
      height: 100%;
      background-color: #102a43;
      border-radius: 3px;
    }

    /* Academic Highlight Card */
    .academic-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .academic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .academic-score-badge {
      background: #10b981;
      color: #ffffff;
      font-weight: 800;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .academic-metric {
      font-size: 9.5px;
      color: #475569;
      line-height: 1.35;
    }

    /* List styling left */
    .side-list {
      list-style: none;
      margin-bottom: 12px;
    }
    .side-list-item {
      font-size: 9.5px;
      color: #334155;
      margin-bottom: 4px;
      position: relative;
      padding-left: 12px;
    }
    .side-list-item::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #f59e0b;
      font-size: 12px;
      line-height: 1;
    }

    /* ── RIGHT COLUMN (Main Content) ─────────────────────────────────── */
    .col-right {
      width: 65%;
      padding: 2px 4px 10px 4px;
    }
    .section-title-right {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #102a43;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Timeline style (matching visual reference) */
    .timeline {
      position: relative;
      margin-bottom: 14px;
      padding-left: 18px;
    }
    .timeline::before {
      content: "";
      position: absolute;
      top: 4px;
      bottom: 6px;
      left: 5px;
      width: 2px;
      background-color: #cbd5e1;
    }
    .timeline-node {
      position: relative;
      margin-bottom: 10px;
    }
    .timeline-node:last-child {
      margin-bottom: 0;
    }
    .timeline-dot {
      position: absolute;
      left: -18px;
      top: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #102a43;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px #102a43;
    }
    .node-title {
      font-size: 11px;
      font-weight: 700;
      color: #102a43;
      line-height: 1.25;
    }
    .node-sub {
      font-size: 9.5px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 2px;
    }
    .node-period {
      font-size: 9px;
      color: #64748b;
      margin-bottom: 3px;
    }
    .node-bullets {
      list-style-type: disc;
      padding-left: 14px;
      font-size: 9.5px;
      color: #334155;
    }
    .node-bullets li {
      margin-bottom: 2px;
    }

    /* Portfolio Cards Grid / Stream */
    .portfolio-grid {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 14px;
    }
    .portfolio-item {
      background: #fafaf9;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #102a43;
      border-radius: 4px;
      padding: 6px 8px;
    }
    .portfolio-title-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .portfolio-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #102a43;
    }
    .portfolio-year {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
    }
    .portfolio-role {
      font-size: 9px;
      font-weight: 600;
      color: #4338ca;
      margin-bottom: 2px;
    }
    .portfolio-desc {
      font-size: 9px;
      color: #475569;
      margin-bottom: 3px;
      line-height: 1.35;
    }
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }
    .tech-tag {
      background: #e2e8f0;
      color: #1e293b;
      font-size: 8px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 3px;
    }

    /* Achievements */
    .achievement-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 3px solid #f59e0b;
      border-radius: 4px;
      padding: 5px 8px;
      margin-bottom: 5px;
    }
    .achievement-title {
      font-size: 10px;
      font-weight: 700;
      color: #92400e;
    }
    .achievement-desc {
      font-size: 9px;
      color: #78350f;
    }

    /* ── FOOTER ───────────────────────────────────────────────────────── */
    .cv-footer {
      margin-top: 10px;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Web Action Bar (Hanya tampil di browser, otomatis hilang saat dicetak / PDF) -->
    <div class="web-action-bar no-print">
      <div class="bar-title">📄 Curriculum Vitae - Naelul Kirom Indalloh (A4 Ready)</div>
      <div class="bar-buttons">
        <button class="bar-btn btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
        <button class="bar-btn btn-close" onclick="window.close()">✖ Tutup</button>
      </div>
    </div>

    <!-- 1. HEADER (Photo + Name + Title + Dark Navy Ribbon) -->
    <header class="header">
      <div class="avatar-wrapper">
        <div class="avatar-ring">
          <img class="avatar-img" src="${photoBase64}" alt="${escapeHtml(profile?.nama)}" />
        </div>
      </div>
      <div class="header-text">
        <h1 class="header-name">${escapeHtml(profile?.nama || 'Naelul Kirom Indalloh')}</h1>
        <div class="header-title">
          <span>${escapeHtml(profile?.profesi || 'Information Systems Student & System Analyst')}</span>
          <span class="header-badge">NIM: ${escapeHtml(profile?.nim || '242505011')}</span>
        </div>

        <!-- Dark Navy Ribbon Contact Bar -->
        <div class="contact-ribbon">
          <div class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <span>${escapeHtml(profile?.kontak?.email || 'naelulkirom@gmail.com')}</span>
          </div>
          <div class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            <span>${escapeHtml(profile?.kontak?.whatsapp || '+62895328620093')}</span>
          </div>
          <div class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>
            <span>${escapeHtml(profile?.kontak?.github ? profile.kontak.github.replace(/^https?:\/\/(www\.)?github\.com\//, '') : 'sunghoon31')}</span>
          </div>
          <div class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
            <span>@${escapeHtml(profile?.kontak?.instagram ? profile.kontak.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '') : 'elqi_6')}</span>
          </div>
          <div class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>Bandung / Sumedang</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. BODY (2 Columns Layout) -->
    <main class="body-columns">
      <!-- ── LEFT COLUMN ──────────────────────────────────────────────── -->
      <aside class="col-left">
        <!-- Tentang Saya -->
        <section>
          <h2 class="section-title-left">Tentang Saya</h2>
          <p class="about-text">${escapeHtml(profile?.deskripsi || '')}</p>
        </section>

        <!-- Capaian Akademik (UTS Pemrograman Mobile 2) -->
        <section>
          <h2 class="section-title-left">Capaian Akademik</h2>
          <div class="academic-box">
            <div class="academic-header">
              <strong style="color: #102a43; font-size: 10px;">${escapeHtml(score?.akademik?.mataKuliah || 'Pemrograman Mobile 2')}</strong>
              <span class="academic-score-badge">Nilai ${score?.currentScore?.nilai || 89} (${score?.currentScore?.grade || 'A'})</span>
            </div>
            <div class="academic-metric">Dosen: ${escapeHtml(score?.akademik?.dosen || 'Iin Solihin, M.Kom')}</div>
            <div class="academic-metric" style="margin-top: 4px; font-weight: 600;">
              Attendance: 100% · Quest: 95% · Practice: 87% · Challenge: 100%
            </div>
            <div class="academic-metric" style="margin-top: 2px; color: #4338ca; font-weight: 700;">
              Total Learning Points: ${(score?.learningPoints?.total || 12375).toLocaleString()} LP
            </div>
          </div>
        </section>

        <!-- Keahlian (Skills with Sleek Horizontal Bars) -->
        <section class="skills-group">
          <h2 class="section-title-left">Keahlian Utama</h2>
          ${displaySkills
            .map(
              (item) => `
            <div class="skill-item">
              <div class="skill-info">
                <span>${escapeHtml(item.nama)}</span>
                <span>${item.level}%</span>
              </div>
              <div class="skill-track">
                <div class="skill-fill" style="width: ${item.level}%;"></div>
              </div>
            </div>`
            )
            .join('')}
        </section>

        <!-- Minat & Hobi -->
        <section>
          <h2 class="section-title-left">Minat & Hobi</h2>
          <ul class="side-list">
            ${hobbies
              .map(
                (h) => `
              <li class="side-list-item">
                <strong>${escapeHtml(h.nama)}</strong>: ${escapeHtml(h.deskripsi.substring(0, 75))}...
              </li>`
              )
              .join('')}
          </ul>
        </section>

        <!-- Bahasa -->
        <section>
          <h2 class="section-title-left">Bahasa</h2>
          <ul class="side-list">
            <li class="side-list-item"><strong>Bahasa Indonesia</strong> — Penutur Asli (Native)</li>
            <li class="side-list-item"><strong>Bahasa Sunda</strong> — Bahasa Daerah (Fluent)</li>
            <li class="side-list-item"><strong>Bahasa Inggris</strong> — Pemahaman Teknis (Working Proficiency)</li>
          </ul>
        </section>
      </aside>

      <!-- ── RIGHT COLUMN ─────────────────────────────────────────────── -->
      <section class="col-right">
        <!-- Pengalaman Organisasi & Kepanitiaan (Timeline View) -->
        <div>
          <h2 class="section-title-right">Pengalaman Organisasi & Kepanitiaan</h2>
          <div class="timeline">
            ${orgItems
              .map(
                (item) => `
              <div class="timeline-node">
                <span class="timeline-dot"></span>
                <div class="node-title">${escapeHtml(item.judul)}</div>
                <div class="node-sub">${escapeHtml(item.instansi)}</div>
                <div class="node-period">${escapeHtml(item.periode)}</div>
                <ul class="node-bullets">
                  <li>${escapeHtml(item.deskripsi)}</li>
                  ${item.keterangan ? `<li>${escapeHtml(item.keterangan)}</li>` : ''}
                </ul>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- Portofolio Proyek Unggulan -->
        <div>
          <h2 class="section-title-right">Portofolio Proyek Unggulan</h2>
          <div class="portfolio-grid">
            ${portfolio
              .slice(0, 4)
              .map(
                (p) => `
              <div class="portfolio-item">
                <div class="portfolio-title-row">
                  <span class="portfolio-title">${escapeHtml(p.judul)}</span>
                  <span class="portfolio-year">${p.tahun}</span>
                </div>
                <div class="portfolio-role">${escapeHtml(p.peran)}</div>
                <p class="portfolio-desc">${escapeHtml(p.ringkasan)}</p>
                <div class="tech-tags">
                  ${(p.teknologi || [])
                    .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
                    .join('')}
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- Riwayat Pendidikan -->
        <div>
          <h2 class="section-title-right">Riwayat Pendidikan</h2>
          <div class="timeline">
            ${educationItems
              .map(
                (edu) => `
              <div class="timeline-node">
                <span class="timeline-dot"></span>
                <div class="node-title">${escapeHtml(edu.judul)}</div>
                <div class="node-sub">${escapeHtml(edu.instansi)} · ${escapeHtml(edu.periode)}</div>
                <ul class="node-bullets">
                  <li>${escapeHtml(edu.deskripsi)}</li>
                </ul>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- Prestasi & Penghargaan -->
        <div>
          <h2 class="section-title-right">Prestasi & Penghargaan</h2>
          ${achievementItems
            .map(
              (ach) => `
            <div class="achievement-card">
              <div class="achievement-title">🏆 ${escapeHtml(ach.judul)} (${ach.periode})</div>
              <div class="achievement-desc">${escapeHtml(ach.instansi)} — ${escapeHtml(ach.keterangan || ach.deskripsi)}</div>
            </div>`
            )
            .join('')}
        </div>
      </section>
    </main>

    <!-- 3. FOOTER -->
    <footer class="cv-footer">
      <span>Dokumen Resmi Dibuat Melalui Aplikasi Mobile <strong>UTS_NaelulApp</strong></span>
      <span>${escapeHtml(profile?.kampus || 'Universitas Ma\'soem')} · Fakultas ${escapeHtml(profile?.fakultas || 'Komputer')}</span>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Web Helper: Prints strictly the CV via an isolated iframe
 * so window.print() will NEVER print the mobile app screen.
 */
function printViaIframe(html) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      resolve();
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const triggerPrint = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Gagal mencetak iframe', err);
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch (_) {}
        resolve();
      }, 1500);
    };

    if (iframe.contentWindow) {
      setTimeout(triggerPrint, 300);
    } else {
      iframe.onload = triggerPrint;
    }
  });
}

/**
 * Web Helper: Opens the CV document in a brand new browser tab
 * allowing full-screen preview and clean print.
 */
function openInNewTab(html) {
  if (typeof window === 'undefined') return { success: true };

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const newWin = window.open(url, '_blank');

  if (!newWin) {
    // Popup was blocked by browser, fallback to isolated iframe print
    return printViaIframe(html);
  }
  return { success: true, mode: 'web-new-tab' };
}

/**
 * Service to generate and export the CV PDF
 */
export const cvPdfService = {
  /**
   * Fetch all application data and compile into HTML
   */
  async getCompiledCvHtml() {
    const [profile, score, skills, experience, hobbies, portfolio] = await Promise.all([
      profileService.getProfile(),
      scoreService.getScore(),
      profileService.getSkills(),
      profileService.getExperience(),
      profileService.getHobbies(),
      portfolioService.getProjects(),
    ]);

    return buildCvHtml({
      profile,
      score,
      skills,
      experience,
      hobbies,
      portfolio,
      photoBase64: PROFILE_PHOTO_BASE64,
    });
  },

  /**
   * Generates PDF file or opens clean document preview in new tab
   */
  async exportPdf() {
    const html = await this.getCompiledCvHtml();

    if (Platform.OS === 'web') {
      // In web browser: open in dedicated tab with A4 preview and print button
      return openInNewTab(html);
    }

    // On native mobile devices, create PDF file in cache
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Check if sharing is supported on this device
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Simpan atau Bagikan CV Naelul Kirom Indalloh',
      });
    } else {
      // Fallback: trigger system print
      await Print.printAsync({ uri });
    }

    return { success: true, uri, mode: 'file-shared' };
  },

  /**
   * Directly triggers isolated print (Iframe on Web, Native Print on Mobile)
   */
  async printDirectly() {
    const html = await this.getCompiledCvHtml();

    if (Platform.OS === 'web') {
      await printViaIframe(html);
      return { success: true, mode: 'iframe-print' };
    }

    await Print.printAsync({ html });
    return { success: true, mode: 'direct-print' };
  },
};
