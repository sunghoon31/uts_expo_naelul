import { useState, useMemo, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

export function usePortfolioFilter(projects = []) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState('Semua');

  // Load last selected filter from AsyncStorage
  useEffect(() => {
    async function loadSavedFilter() {
      const saved = await getStorageItem(STORAGE_KEYS.PORTFOLIO_FILTER);
      if (saved && typeof saved === 'string') {
        setSelectedCategoryState(saved);
      }
    }
    loadSavedFilter();
  }, []);

  const setSelectedCategory = async (category) => {
    setSelectedCategoryState(category);
    await setStorageItem(STORAGE_KEYS.PORTFOLIO_FILTER, category);
  };

  // Derive categories list dynamically from projects
  const categories = useMemo(() => {
    const cats = new Set(['Semua']);
    if (Array.isArray(projects)) {
      projects.forEach((p) => {
        if (p.kategori) cats.add(p.kategori);
      });
    }
    return Array.from(cats);
  }, [projects]);

  // Filter projects by category and keyword
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    return projects.filter((project) => {
      // Category check
      const matchesCategory =
        selectedCategory === 'Semua' ||
        project.kategori?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      // Keyword check
      if (!keyword || keyword.trim() === '') return true;

      const q = keyword.toLowerCase().trim();
      const inTitle = project.judul?.toLowerCase().includes(q);
      const inSummary = project.ringkasan?.toLowerCase().includes(q);
      const inCat = project.kategori?.toLowerCase().includes(q);
      const inTech = Array.isArray(project.teknologi)
        ? project.teknologi.some((tech) => tech.toLowerCase().includes(q))
        : false;

      return inTitle || inSummary || inCat || inTech;
    });
  }, [projects, selectedCategory, keyword]);

  return {
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProjects,
  };
}

