import profileData from '../data/profile.json';
import scoreData from '../data/score.json';
import skillsData from '../data/skills.json';
import portfolioData from '../data/portfolio.json';
import experienceData from '../data/experience.json';
import hobbiesData from '../data/hobbies.json';

describe('Data JSON Validation (T-12 & FR-23)', () => {
  describe('profile.json', () => {
    it('memiliki data identitas lengkap dan valid', () => {
      expect(profileData.nama).toBe('Naelul Kirom Indalloh');
      expect(profileData.nim).toBe('242505011');
      expect(profileData.kampus).toContain("Ma'soem");
      expect(profileData.profesi).toBeTruthy();
      expect(profileData.deskripsi).toBeTruthy();
      expect(profileData.kontak.email).toBeTruthy();
    });
  });

  describe('score.json (Persyaratan Level 8 Soal UTS)', () => {
    it('memiliki nilai, grade, dan LP persis sesuai soal', () => {
      expect(scoreData.currentScore.nilai).toBe(89);
      expect(scoreData.currentScore.grade).toBe('A');
      expect(scoreData.learningPoints.total).toBe(12375);
      expect(scoreData.learningPoints.satuan).toBe('LP');
    });

    it('memiliki 4 indikator progres belajar dengan persentase tepat', () => {
      expect(Array.isArray(scoreData.learningProgress)).toBe(true);
      expect(scoreData.learningProgress.length).toBe(4);

      const findIndicator = (label) =>
        scoreData.learningProgress.find((p) => p.label.toLowerCase() === label.toLowerCase());

      expect(findIndicator('Attendance')?.persen).toBe(100);
      expect(findIndicator('Practice')?.persen).toBe(87);
      expect(findIndicator('Quest')?.persen).toBe(95);
      expect(findIndicator('Challenge')?.persen).toBe(100);
    });

    it('mencantumkan catatan data dummy sesuai NFR-09', () => {
      expect(scoreData.catatan).toContain('Data dummy');
    });
  });

  describe('skills.json (FR-26)', () => {
    it('dikelompokkan per kategori dan memiliki skill dengan level 0-100', () => {
      expect(Array.isArray(skillsData)).toBe(true);
      expect(skillsData.length).toBeGreaterThan(0);

      const allIds = new Set();
      skillsData.forEach((cat) => {
        expect(cat.kategori).toBeTruthy();
        expect(Array.isArray(cat.items)).toBe(true);
        cat.items.forEach((item) => {
          expect(item.id).toBeTruthy();
          expect(allIds.has(item.id)).toBe(false);
          allIds.add(item.id);
          expect(item.level).toBeGreaterThanOrEqual(0);
          expect(item.level).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('portfolio.json (FR-27)', () => {
    it('memiliki ID unik, judul, kategori, dan teknologi', () => {
      expect(Array.isArray(portfolioData)).toBe(true);
      const allIds = new Set();
      portfolioData.forEach((project) => {
        expect(project.id).toBeTruthy();
        expect(allIds.has(project.id)).toBe(false);
        allIds.add(project.id);
        expect(project.judul).toBeTruthy();
        expect(project.kategori).toBeTruthy();
        expect(Array.isArray(project.teknologi)).toBe(true);
      });
    });
  });

  describe('experience.json (FR-30)', () => {
    it('memiliki jenis pendidikan dan organisasi', () => {
      expect(Array.isArray(experienceData)).toBe(true);
      const types = experienceData.map((e) => e.jenis);
      expect(types).toContain('pendidikan');
      expect(types).toContain('organisasi');
    });
  });

  describe('hobbies.json (FR-31)', () => {
    it('memiliki nama hobi dan nama icon', () => {
      expect(Array.isArray(hobbiesData)).toBe(true);
      hobbiesData.forEach((h) => {
        expect(h.nama).toBeTruthy();
        expect(h.ikon).toBeTruthy();
      });
    });
  });
});

