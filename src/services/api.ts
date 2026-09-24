import { StudentData, OrderConfig } from '../types';

export interface ServerDataResponse {
  success: boolean;
  students: StudentData[];
  orderConfig: OrderConfig;
  updatedAt: string;
}

export const api = {
  // Fetch all saved data from server database
  async fetchAllData(): Promise<ServerDataResponse | null> {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Could not fetch data from server database, using local cache:', e);
      return null;
    }
  },

  // Save or append student list
  async saveStudents(students: StudentData[], append: boolean = false): Promise<boolean> {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students, append }),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to save students to server database:', e);
      return false;
    }
  },

  // Save or update single student
  async updateStudent(student: StudentData): Promise<boolean> {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(student.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to update student on server:', e);
      return false;
    }
  },

  // Delete single student
  async deleteStudent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete student from server:', e);
      return false;
    }
  },

  // Delete bulk students
  async deleteBulkStudents(ids: string[]): Promise<boolean> {
    try {
      const res = await fetch('/api/students/delete-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete bulk students from server:', e);
      return false;
    }
  },

  // Delete all students in a region
  async deleteRegion(regionName: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/regions/${encodeURIComponent(regionName)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete region from server:', e);
      return false;
    }
  },

  // Clear all students
  async clearAllStudents(): Promise<boolean> {
    try {
      const res = await fetch('/api/students/all', {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to clear students from server:', e);
      return false;
    }
  },

  // Reset to sample data
  async resetToSample(): Promise<ServerDataResponse | null> {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Failed to reset data on server:', e);
      return null;
    }
  },

  // Save order config
  async saveConfig(config: OrderConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to save config to server:', e);
      return false;
    }
  },
};
