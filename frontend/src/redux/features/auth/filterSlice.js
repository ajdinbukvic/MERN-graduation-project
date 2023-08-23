import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredUsers: [],
  filteredProjects: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_USERS(state, action) {
      const { users, search } = action.payload;
      const tempUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredUsers = tempUsers;
    },
    FILTER_PROJECTS(state, action) {
      const { projects, search } = action.payload;
      const tempProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProjects = tempProjects;
    },
  },
});

export const { FILTER_USERS } = filterSlice.actions;
export const { FILTER_PROJECTS } = filterSlice.actions;

export const selectFilteredUsers = (state) => state.filter.filteredUsers;
export const selectFilteredProjects = (state) => state.filter.filteredProjects;

export default filterSlice.reducer;
