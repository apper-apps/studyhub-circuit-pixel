import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = this.courses.find(course => course.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.courses.map(c => c.Id)) + 1;
    const newCourse = {
      Id: newId,
      ...courseData,
      assignmentCount: 0,
      currentGrade: 0,
      gradeCategories: courseData.gradeCategories || []
    };
    
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = { ...this.courses[index], ...updateData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return { success: true };
  }

  async getCoursesWithStats() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return this.courses.map(course => ({
      ...course,
      assignmentCount: course.assignmentCount || Math.floor(Math.random() * 15) + 3,
    }));
  }
}

export default new CourseService();