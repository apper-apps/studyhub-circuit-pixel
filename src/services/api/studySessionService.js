class StudySessionService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "study_session_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(session => ({
        Id: session.Id,
        courseId: session.course_id_c?.Id || session.course_id_c,
        courseName: session.course_name_c,
        courseColor: session.course_color_c,
        date: session.date_c,
        duration: session.duration_c,
        notes: session.notes_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching study sessions:", error.response.data.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Study session not found");
      }

      const session = response.data;
      return {
        Id: session.Id,
        courseId: session.course_id_c?.Id || session.course_id_c,
        courseName: session.course_name_c,
        courseColor: session.course_color_c,
        date: session.date_c,
        duration: session.duration_c,
        notes: session.notes_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching study session with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(sessionData) {
    try {
      const params = {
        records: [{
          Name: `Study Session - ${sessionData.courseName}`,
          course_id_c: parseInt(sessionData.courseId),
          course_name_c: sessionData.courseName || "",
          course_color_c: sessionData.courseColor || "#5B5FDE",
          date_c: sessionData.date,
          duration_c: sessionData.duration || 0,
          notes_c: sessionData.notes || ""
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
          console.error(`Failed to create study session: ${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const session = successfulRecords[0].data;
          return {
            Id: session.Id,
            courseId: session.course_id_c?.Id || session.course_id_c,
            courseName: session.course_name_c,
            courseColor: session.course_color_c,
            date: session.date_c,
            duration: session.duration_c,
            notes: session.notes_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating study session:", error.response.data.message);
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
          Name: updateData.courseName ? `Study Session - ${updateData.courseName}` : undefined,
          course_id_c: updateData.courseId ? parseInt(updateData.courseId) : undefined,
          course_name_c: updateData.courseName,
          course_color_c: updateData.courseColor,
          date_c: updateData.date,
          duration_c: updateData.duration,
          notes_c: updateData.notes
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
          console.error(`Failed to update study session: ${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const session = successfulUpdates[0].data;
          return {
            Id: session.Id,
            courseId: session.course_id_c?.Id || session.course_id_c,
            courseName: session.course_name_c,
            courseColor: session.course_color_c,
            date: session.date_c,
            duration: session.duration_c,
            notes: session.notes_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating study session:", error.response.data.message);
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
        console.error("Error deleting study session:", error.response.data.message);
      } else {
        console.error(error);
      }
      throw error;
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
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "notes_c" } }
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

      return response.data?.map(session => ({
        Id: session.Id,
        courseId: session.course_id_c?.Id || session.course_id_c,
        courseName: session.course_name_c,
        courseColor: session.course_color_c,
        date: session.date_c,
        duration: session.duration_c,
        notes: session.notes_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching study sessions by course:", error.response.data.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getRecentSessions(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "course_name_c" } },
          { field: { Name: "course_color_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
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

      return response.data?.map(session => ({
        Id: session.Id,
        courseId: session.course_id_c?.Id || session.course_id_c,
        courseName: session.course_name_c,
        courseColor: session.course_color_c,
        date: session.date_c,
        duration: session.duration_c,
        notes: session.notes_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent study sessions:", error.response.data.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getTotalStudyTime() {
    try {
      const sessions = await this.getAll();
      return sessions.reduce((total, session) => total + (session.duration || 0), 0);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error calculating total study time:", error.response.data.message);
      } else {
        console.error(error);
      }
      return 0;
    }
  }
}

export default new StudySessionService();