import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.assignments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = this.assignments.find(assignment => assignment.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.assignments.map(a => a.Id)) + 1;
    const newAssignment = {
      Id: newId,
      ...assignmentData,
      completed: false,
      grade: null
    };
    
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index] = { ...this.assignments[index], ...updateData };
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments.splice(index, 1);
    return { success: true };
  }

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index].completed = !this.assignments[index].completed;
    return { ...this.assignments[index] };
  }

  async getUpcoming(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const now = new Date();
    return this.assignments
      .filter(assignment => !assignment.completed && new Date(assignment.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, limit);
  }

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.assignments.filter(assignment => assignment.courseId === courseId.toString());
  }
}

export default new AssignmentService();