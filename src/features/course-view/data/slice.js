/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'course-view',
  initialState: {
    isMobileSidebarOpen: false,
    isDesktopSidebarExtended: true,
    layoutHasSidebar: true,
  },
  reducers: {
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    openMobileSidebar: (state) => {
      state.isMobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
    toggleDesktopSidebar: (state) => {
      state.isDesktopSidebarExtended = !state.isDesktopSidebarExtended;
    },
    openDesktopSidebarr: (state) => {
      state.isDesktopSidebarExtended = true;
    },
    closeDesktopSidebar: (state) => {
      state.isDesktopSidebarExtended = false;
    },
    setLayoutHasSidebar: (state, { payload }) => {
      state.layoutHasSidebar = payload;
    },
  },
});

export const {
  toggleMobileSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  toggleDesktopSidebar,
  openDesktopSidebarr,
  closeDesktopSidebar,
  setLayoutHasSidebar,
} = slice.actions;

export const {
  reducer,
} = slice;
