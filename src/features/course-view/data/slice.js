/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'course-view',
  initialState: {
    isMobileSidebarOpen: false,
    isDesktopSidebarExtended: true,
    sidebarItems: {},
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
    initSectionSequenceUnitStates: (state, { payload }) => {
      state.sidebarItems = payload.sidebarItemsDefault;
    },
    toggleOpenCollapseSidebarItem: (state, { payload: { id } }) => {
      state.sidebarItems[id] = Boolean(!state.sidebarItems[id]);
    },
    collapseAllSidebarItems: (state => {
      const sidebarItemKeys = Object.keys(state.sidebarItems);
      for (let index = 0; index < sidebarItemKeys.length; index++) {
        const key = sidebarItemKeys[index];
        state.sidebarItems[key] = false;
      }
    }),
    expandAllSidebarItems: state => {
      const sidebarItemKeys = Object.keys(state.sidebarItems);
      for (let index = 0; index < sidebarItemKeys.length; index++) {
        const key = sidebarItemKeys[index];
        state.sidebarItems[key] = true;
      }
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
  initSectionSequenceUnitStates,
  toggleOpenCollapseSidebarItem,
  collapseAllSidebarItems,
  expandAllSidebarItems,
} = slice.actions;

export const {
  reducer,
} = slice;
