import portfolioData from '../data/portfolio.json';
import { mockApiCall } from './api';

export const portfolioService = {
  async getProjects() {
    return mockApiCall(() => portfolioData, 550);
  },

  async getProjectById(id) {
    return mockApiCall(() => {
      const project = portfolioData.find((item) => String(item.id) === String(id));
      if (!project) {
        throw new Error(`Proyek dengan ID "${id}" tidak ditemukan.`);
      }
      return project;
    }, 450);
  },
};

