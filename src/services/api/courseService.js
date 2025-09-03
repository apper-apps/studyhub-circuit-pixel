class CourseService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "course_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "term_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "assignment_count_c" } },
          { field: { Name: "grade_categories_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "description_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data?.map(course => ({
        Id: course.Id,
        name: course.Name,
        code: course.code_c,
        color: course.color_c,
        term: course.term_c,
        credits: course.credits_c,
        currentGrade: course.current_grade_c,
        assignmentCount: course.assignment_count_c,
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
        instructor: course.instructor_c,
        location: course.location_c,
        schedule: course.schedule_c,
        description: course.description_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error.response.data.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "term_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "assignment_count_c" } },
          { field: { Name: "grade_categories_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "description_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Course not found");
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.Name,
        code: course.code_c,
        color: course.color_c,
        term: course.term_c,
        credits: course.credits_c,
        currentGrade: course.current_grade_c,
        assignmentCount: course.assignment_count_c,
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
        instructor: course.instructor_c,
        location: course.location_c,
        schedule: course.schedule_c,
        description: course.description_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [{
          Name: courseData.name,
          code_c: courseData.code,
          color_c: courseData.color,
          term_c: courseData.term,
          credits_c: courseData.credits,
          current_grade_c: 0,
          assignment_count_c: 0,
          grade_categories_c: JSON.stringify(courseData.gradeCategories || []),
          instructor_c: courseData.instructor || "",
          location_c: courseData.location || "",
          schedule_c: courseData.schedule || "",
          description_c: courseData.description || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create course: ${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const course = successfulRecords[0].data;
          return {
            Id: course.Id,
            name: course.Name,
            code: course.code_c,
            color: course.color_c,
            term: course.term_c,
            credits: course.credits_c,
            currentGrade: course.current_grade_c,
            assignmentCount: course.assignment_count_c,
            gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
            instructor: course.instructor_c,
            location: course.location_c,
            schedule: course.schedule_c,
            description: course.description_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.name,
          code_c: updateData.code,
          color_c: updateData.color,
          term_c: updateData.term,
          credits_c: updateData.credits,
          grade_categories_c: JSON.stringify(updateData.gradeCategories || []),
          instructor_c: updateData.instructor || "",
          location_c: updateData.location || "",
          schedule_c: updateData.schedule || "",
          description_c: updateData.description || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update course: ${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const course = successfulUpdates[0].data;
          return {
            Id: course.Id,
            name: course.Name,
            code: course.code_c,
            color: course.color_c,
            term: course.term_c,
            credits: course.credits_c,
            currentGrade: course.current_grade_c,
            assignmentCount: course.assignment_count_c,
            gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [],
            instructor: course.instructor_c,
            location: course.location_c,
            schedule: course.schedule_c,
            description: course.description_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getCoursesWithStats() {
    // For stats version, just get all courses - assignment counts come from database
    return await this.getAll();
  }
}

export default new CourseService();