import studySessionsData from "@/services/mockData/studySessions.json";

class StudySessionService {
  constructor() {
    this.studySessions = [...studySessionsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.studySessions];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const session = this.studySessions.find(session => session.Id === parseInt(id));
    if (!session) {
      throw new Error("Study session not found");
    }
    return { ...session };
  }

  async create(sessionData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = Math.max(...this.studySessions.map(s => s.Id)) + 1;
    const newSession = {
      Id: newId,
      ...sessionData,
      date: new Date(sessionData.date).toISOString()
    };
    
    this.studySessions.push(newSession);
    return { ...newSession };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.studySessions.findIndex(session => session.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Study session not found");
    }
    
    this.studySessions[index] = { ...this.studySessions[index], ...updateData };
    return { ...this.studySessions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.studySessions.findIndex(session => session.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Study session not found");
    }
    
    this.studySessions.splice(index, 1);
    return { success: true };
  }

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.studySessions.filter(session => session.courseId === courseId.toString());
  }

  async getRecentSessions(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.studySessions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async getTotalStudyTime() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return this.studySessions.reduce((total, session) => total + session.duration, 0);
  }
}

export default new StudySessionService();