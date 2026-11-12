import scoreData from '../data/score.json';
import { mockApiCall } from './api';

export const scoreService = {
  async getScore() {
    return mockApiCall(() => scoreData, 500);
  },
};

