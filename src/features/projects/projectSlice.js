import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import {config} from '../../config/config';

const initialState = {
    allProjects: [],
    isProjectModalVisible: false,
    projectBeingModified: null,
    loading: false,
    error: null
};

export const fetchProjects = createAsyncThunk('project/fetchProjects',
    async () => {
      try {
        const response = await axios.get('https://api.todoist.com/rest/v2/projects', {
          headers: {
            Authorization: `Bearer ${config.apiToken}`,
          },
        });

        return response.data;
      } catch (error) {
        return error.message;
      }
    }
  );
  
  export const addProject = createAsyncThunk('project/addProject',async (projectDetails) => {
      try {
        const response = await axios.post(
          'https://api.todoist.com/rest/v2/projects',
          projectDetails,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Request-Id': nanoid(),
              Authorization: `Bearer ${config.apiToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return error.message;
      }
    }
  );
  
  export const updateProject = createAsyncThunk('project/updateProject',
    async ({ id, updatedData }) => {
      try {
        const response = await axios.post(
          `https://api.todoist.com/rest/v2/projects/${id}`,
          updatedData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.apiToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return error.message;
      }
    }
  );
  
  export const deleteProject = createAsyncThunk('project/deleteProject',
    async (id) => {
      try {
        await axios.delete(`https://api.todoist.com/rest/v2/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${config.apiToken}`,
          },
        });
        return id;
      } catch (error) {
        return error.message;
      }
    }
  );

  export const toggleFavoriteInBackend = createAsyncThunk(
    'project/toggleFavoriteInBackend',
    async (projectId, { getState, rejectWithValue }) => {
      
      const project = getState().project.allProjects.find(
        (project) => project.id === projectId
      );
       
      project.is_favorite = !project.is_favorite;

      try { 
        const response = await axios.post(
          `https://api.todoist.com/rest/v2/projects/${projectId}`,project,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.apiToken}`,
            },
          }
        );
  
        return response.data; // Return updated project data from backend
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


  const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {

      setIsProjectModalVisible(state, action){
        state.isProjectModalVisible = action.payload;
      },

      setProjectBeingModified(state, action){
        state.projectBeingModified = action.payload;
      },

      toggleFavorite(state, action){
        const project = state.allProjects.find((project) => project.id === action.payload);
        if (project) {
          project.is_favorite = !project.is_favorite;
        }
      },
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProjects.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
          state.loading = false;
          state.allProjects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch projects';
        })
        .addCase(addProject.fulfilled, (state, action) => {
          state.allProjects.push(action.payload);
        })
        .addCase(updateProject.fulfilled, (state, action) => {
          state.allProjects = state.allProjects.map((project) =>
            project.id === action.payload.id ? action.payload : project
          );
        })
        .addCase(deleteProject.fulfilled, (state, action) => {
          state.allProjects = state.allProjects.filter((project) => project.id !== action.payload);
        })
        .addCase(toggleFavoriteInBackend.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(toggleFavoriteInBackend.fulfilled, (state, action) => {
          state.loading = false;
          const updatedProject = action.payload;
  
          // Update the favorite status in the state with the backend response
          state.allProjects = state.allProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          );
        })
        .addCase(toggleFavoriteInBackend.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update favorite status';
        });
    },
  });
  
  export const allProjects = (state) => state.project.allProjects;

  export const isProjectDataLoading = (state) => state.project.loading;

  export const projectDataError = (state) => state.project.error;

  export const projectBeingModified = (state) => state.project.projectBeingModified;

  export const isProjectModalVisible = (state) => state.project.isProjectModalVisible;


  export const {
    setIsProjectModalVisible,
    setProjectBeingModified,
    toggleFavorite,
  } = projectSlice.actions;
  
  export default projectSlice.reducer;