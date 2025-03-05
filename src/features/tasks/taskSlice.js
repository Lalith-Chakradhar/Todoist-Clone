import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config';

const initialState = {
    allTasks: [],
    isModalOpen: false,
    taskBeingEdited: null,
    isDeleteModalVisible: false,
    taskToDelete: null,
    editMode: false,
    loading: false,
    error: null,
  };

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.todoist.com/rest/v2/tasks', {
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'task/addTask',
  async (taskDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://api.todoist.com/rest/v2/tasks',
        taskDetails,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': uuidv4(),
            Authorization: `Bearer ${config.apiToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.todoist.com/rest/v2/tasks/${id}`,
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
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://api.todoist.com/rest/v2/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTaskModalVisible: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setTaskBeingEdited: (state, action) => {
      state.taskBeingEdited = action.payload;
      state.editMode = !action.payload;
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.allTasks.find((t) => t.id === action.payload);
      if (task) {
        task.is_completed = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.allTasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.allTasks = state.allTasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.allTasks = state.allTasks.filter((task) => task.id !== action.payload);
        state.isDeleteModalVisible = false;
        state.taskToDelete = null;
      });
  },
});

export const { 
  setTaskModalVisible, 
  setTaskBeingEdited, 
  setTaskBeingDeleted,
  toggleTaskCompletion
} = taskSlice.actions;

export default taskSlice.reducer;