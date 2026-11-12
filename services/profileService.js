import profileData from '../data/profile.json';
import skillsData from '../data/skills.json';
import experienceData from '../data/experience.json';
import hobbiesData from '../data/hobbies.json';
import { mockApiCall } from './api';

export const profileService = {
  async getProfile() {
    return mockApiCall(() => profileData, 500);
  },

  async getSkills() {
    return mockApiCall(() => skillsData, 550);
  },

  async getExperience() {
    return mockApiCall(() => experienceData, 500);
  },

  async getHobbies() {
    return mockApiCall(() => hobbiesData, 500);
  },
};

