/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'sidebar',
  initialState: {
    collapsibleMenuState: {},
  },
  reducers: {
    updateCollapsibleMenuState: (state, { payload }) => {
      payload.forEach((id) => {
        state.collapsibleMenuState[id] = Boolean(state.collapsibleMenuState[id]);
      });
    },
    toggleOpenCollapseSidebarItem: (state, { payload: { id } }) => {
      state.collapsibleMenuState[id] = Boolean(!state.collapsibleMenuState[id]);
    },
    setOpenCollapseSidebarItem: (state, { payload: { id, isOpen } }) => {
      state.collapsibleMenuState[id] = Boolean(isOpen);
    },
    collapseAllSidebarItems: (state => {
      const sidebarItemKeys = Object.keys(state.collapsibleMenuState);
      for (let index = 0; index < sidebarItemKeys.length; index++) {
        const key = sidebarItemKeys[index];
        state.collapsibleMenuState[key] = false;
      }
    }),
    expandAllSidebarItems: state => {
      const sidebarItemKeys = Object.keys(state.collapsibleMenuState);
      for (let index = 0; index < sidebarItemKeys.length; index++) {
        const key = sidebarItemKeys[index];
        state.collapsibleMenuState[key] = true;
      }
    },
  },
});

export const {
  updateCollapsibleMenuState,
  toggleOpenCollapseSidebarItem,
  setOpenCollapseSidebarItem,
  collapseAllSidebarItems,
  expandAllSidebarItems,
} = slice.actions;

export const {
  reducer,
} = slice;
