class AssignmentService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "assignment_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_id_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_name_c,
        courseColor: assignment.course_color_c,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        completed: assignment.completed_c,
        grade: assignment.grade_c,
        categoryId: assignment.category_id_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error.response.data.message);
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Assignment not found");
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_name_c,
        courseColor: assignment.course_color_c,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        completed: assignment.completed_c,
        grade: assignment.grade_c,
        categoryId: assignment.category_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.title,
          course_id_c: parseInt(assignmentData.courseId),
          course_name_c: assignmentData.courseName || "",
          course_color_c: assignmentData.courseColor || "#5B5FDE",
          title_c: assignmentData.title,
          description_c: assignmentData.description || "",
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority || "medium",
          completed_c: false,
          grade_c: null,
          category_id_c: assignmentData.categoryId || ""
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
          console.error(`Failed to create assignment: ${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const assignment = successfulRecords[0].data;
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || assignment.course_id_c,
            courseName: assignment.course_name_c,
            courseColor: assignment.course_color_c,
            title: assignment.title_c,
            description: assignment.description_c,
            dueDate: assignment.due_date_c,
            priority: assignment.priority_c,
            completed: assignment.completed_c,
            grade: assignment.grade_c,
            categoryId: assignment.category_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error.response.data.message);
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
          Name: updateData.title,
          course_id_c: updateData.courseId ? parseInt(updateData.courseId) : undefined,
          course_name_c: updateData.courseName,
          course_color_c: updateData.courseColor,
          title_c: updateData.title,
          description_c: updateData.description,
          due_date_c: updateData.dueDate,
          priority_c: updateData.priority,
          completed_c: updateData.completed,
          grade_c: updateData.grade,
          category_id_c: updateData.categoryId
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
          console.error(`Failed to update assignment: ${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const assignment = successfulUpdates[0].data;
          return {
            Id: assignment.Id,
            courseId: assignment.course_id_c?.Id || assignment.course_id_c,
            courseName: assignment.course_name_c,
            courseColor: assignment.course_color_c,
            title: assignment.title_c,
            description: assignment.description_c,
            dueDate: assignment.due_date_c,
            priority: assignment.priority_c,
            completed: assignment.completed_c,
            grade: assignment.grade_c,
            categoryId: assignment.category_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error.response.data.message);
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
        console.error("Error deleting assignment:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async toggleComplete(id) {
    try {
      // First get the current assignment
      const current = await this.getById(id);
      
      // Update with toggled completion status
      return await this.update(id, {
        ...current,
        completed: !current.completed
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling assignment completion:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getUpcoming(limit = 5) {
    try {
      const now = new Date().toISOString();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          },
          {
            FieldName: "due_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [now]
          }
        ],
        orderBy: [
          {
            fieldName: "due_date_c",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_name_c,
        courseColor: assignment.course_color_c,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        completed: assignment.completed_c,
        grade: assignment.grade_c,
        categoryId: assignment.category_id_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming assignments:", error.response.data.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_id_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_name_c,
        courseColor: assignment.course_color_c,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        completed: assignment.completed_c,
        grade: assignment.grade_c,
        categoryId: assignment.category_id_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course:", error.response.data.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
}

export default new AssignmentService();