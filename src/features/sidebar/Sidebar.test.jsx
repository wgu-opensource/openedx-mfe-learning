import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { coursewareReducer, modelsReducer } from '@edx/frontend-app-learning';
import { reducer as sidebarReducer } from './data/slice';
import { reducer as courseViewReducer } from '../course-view/data';
import Sidebar from './Sidebar';
import {
  fireEvent, initializeMockApp, render,
} from '../../setupTest';
import { sidebarMockStore } from '../../constants/mockData';

describe('<Sidebar />', () => {
  let store;
  beforeAll(async () => {
    store = configureStore({
      reducer: {
        models: modelsReducer,
        courseware: coursewareReducer,
        courseView: courseViewReducer,
        sidebar: sidebarReducer,
      },
      preloadedState: sidebarMockStore,
    });
    initializeMockApp();
  });

  it('renders without crashing', () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];

    const { getAllByText } = render(<Sidebar currentUnitId={currentUnitId} />, { store });
    const { models: { sections, sequences, units } } = store.getState();

    Object.values(sections).forEach(section => {
      const sectionTitle = getAllByText(section.title);
      expect(sectionTitle[0]).toBeInTheDocument();
    });
    Object.values(sequences).forEach(sequence => {
      const sequenceTitle = getAllByText(sequence.title);
      expect(sequenceTitle[0]).toBeInTheDocument();
      expect(sequenceTitle[0].offsetHeight).toBe(0); // expect is collapsed
    });
    Object.values(units).forEach(unit => {
      const unitsTitle = getAllByText(unit.title);
      expect(unitsTitle[0]).toBeInTheDocument();
      expect(unitsTitle[0].offsetHeight).toBe(0); // expect is collapsed
    });
  });

  it('section and sequence expand when click on it', async () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];
    const { getByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store });

    const sectionCollapsable = getByTestId('section-collapsable-block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b');
    expect(sectionCollapsable.classList.contains('collapsed')).toBeTruthy();
    const sectionButton = getByTestId('section-button-block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b');
    fireEvent.click(sectionButton);
    expect(sectionCollapsable.classList.contains('collapsed')).toBeFalsy();

    const sequenceCollapsable = getByTestId('sequence-collapsable-block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction');
    expect(sequenceCollapsable.classList.contains('collapsed')).toBeTruthy();
    const sequenceButton = getByTestId('sequence-button-block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction');
    fireEvent.click(sequenceButton);
    expect(sequenceCollapsable.classList.contains('collapsed')).toBeFalsy();
  });

  it('collapse all sidebar items', () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];
    const { getByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store });

    const collapseAllButton = getByTestId('collapse-all-button');
    fireEvent.click(collapseAllButton);
  });

  it('expand all sidebar items', () => {
    const scrollIntoViewMock = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];
    const { getByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store });

    const expandAllButton = getByTestId('expand-all-button');
    fireEvent.click(expandAllButton);
  });

  it('closes sidebar on unit selection in mobile', async () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];
    const { getByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store });

    // Sidebar is already open according to mock data in sidebarMockStore
    const { courseView: { isMobileSidebarOpen: isMobileSidebarOpenInitial } } = store.getState();
    expect(isMobileSidebarOpenInitial).toBeTruthy();

    const unitButton = getByTestId('unit-button-block-v1:edX+DemoX+Demo_Course+type@vertical+block@vertical_0270f6de40fc');
    fireEvent.click(unitButton);

    // It should be closed after clicking a unit
    const { courseView: { isMobileSidebarOpen: isMobileSidebarOpenFinal } } = store.getState();
    expect(isMobileSidebarOpenFinal).toBeFalsy();
  });

  it('shows loading spinner while the sectionSequenceUnits store variable is empty', async () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];

    const emptyStore = configureStore({
      reducer: {
        models: modelsReducer,
        courseware: coursewareReducer,
        courseView: courseViewReducer,
        sidebar: sidebarReducer,
      },
      preloadedState: {
        ...sidebarMockStore,
        models: {
          ...sidebarMockStore.models,
          sections: {},
          sequences: {},
          units: {},
        },
      },
    });

    const { queryByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store: emptyStore });

    const loader = queryByTestId('simple-loader');
    expect(loader).toBeInTheDocument();
  });

  it('doesnt show loading spinner when sectionSequenceUnits is not empty', async () => {
    const currentUnitId = Object.keys(sidebarMockStore.models.units)[0];
    const { queryByTestId } = render(<Sidebar currentUnitId={currentUnitId} />, { store });

    const loader = queryByTestId('simple-loader');
    expect(loader).not.toBeInTheDocument();
  });
});
