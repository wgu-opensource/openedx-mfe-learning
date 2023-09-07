/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCourse, fetchSequence } from '@edx/frontend-app-learning';
import CoursePlayer from '../course-player/CoursePlayer';
import {
  collapseAllSidebarItems,
  expandAllSidebarItems,
  initSectionSequenceUnitStates,
  // toggleDesktopSidebar,
  toggleOpenCollapseSidebarItem,
} from './data/slice';
import {
  isDesktopSidebarExtendedSelector, isMobileSidebarOpenSelector, sectionSequenceUnitsSelector, sidebarItemsSelector,
} from './data/selectors';
import Section from '../../components/Section/Section';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CarrotIconDown from '../../assets/CarrotIcon';
import CarrotIconLeft from '../../assets/CarrotIconLeft';
import { sequenceIdsSelector } from '../course-player/data/selectors';

// TODO: Remove DummySidebar in favor of real Sidebar
const DummySidebar = ({ currentUnitId }) => {
  const dispatch = useDispatch();
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const sidebarItems = useSelector(sidebarItemsSelector);
  const [sectionSequenceUnitsWithCollapsible, setSectionSequenceUnitsWithCollapsible] = useState([]);

  // const toggle = () => {
  //   dispatch(toggleDesktopSidebar());
  // };

  const getSequenceStatus = (sequence) => {
    if (sequence.units.every(unit => unit.complete)) {
      return 'completed';
    }
    if (sequence.units.some(unit => unit.complete)) {
      return 'in-progress';
    }

    return 'pending';
  };

  const getSectionStatus = (section) => {
    if (section.sequences.every(sequence => sequence.status === 'completed')) {
      return 'completed';
    }
    if (section.sequences.some(sequence => sequence.status === 'in-progress')) {
      return 'in-progress';
    }

    return 'pending';
  };

  useEffect(() => {
    const sidebarItemsDefault = {};
    const updatedSectionSequenceUnits = sectionSequenceUnits.map(section => {
      const updatedSection = { ...section };
      updatedSection.status = getSectionStatus(section);

      updatedSection.sequences = section.sequences.map(sequence => {
        const updatedSequence = { ...sequence };
        updatedSequence.status = getSequenceStatus(sequence);
        sidebarItemsDefault[updatedSequence.id] = Boolean(sidebarItems[updatedSequence.id]);
        return updatedSequence;
      });

      sidebarItemsDefault[updatedSection.id] = Boolean(sidebarItems[updatedSection.id]);
      return updatedSection;
    });

    setSectionSequenceUnitsWithCollapsible(updatedSectionSequenceUnits);
    dispatch(initSectionSequenceUnitStates({ sidebarItemsDefault }));
  }, [sectionSequenceUnits]);

  const handleOpenCollapse = (id, type) => {
    dispatch(toggleOpenCollapseSidebarItem({ id, type }));
  };

  const handleCollapseAll = () => dispatch(collapseAllSidebarItems());

  const handleExpandAll = () => dispatch(expandAllSidebarItems());

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button type="button" onClick={handleCollapseAll}><CarrotIconRight /> ALL</button>
        <button type="button" onClick={handleExpandAll}><CarrotIconDown /> ALL</button>
        <CarrotIconLeft />
      </div>
      <div className="sidebar-content">
        <div className="white-background">
          {sectionSequenceUnitsWithCollapsible?.map(section => (
            <Section
              key={section.id}
              sidebarItems={sidebarItems}
              currentUnitId={currentUnitId}
              id={section.id}
              title={section.title}
              status={section.status}
              sequences={section.sequences}
              onOpenCollapse={handleOpenCollapse}
            />
          ))}
        </div>
      </div>
      {/* <button type="button" onClick={toggle}>Toggle</button> */}
    </div>
  );
};

DummySidebar.propTypes = {
  currentUnitId: PropTypes.string.isRequired,
};

const CourseView = (props) => {
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);
  const isMobileSidebarClosed = !useSelector(isMobileSidebarOpenSelector);
  const sequenceIds = useSelector(sequenceIdsSelector);
  const dispatch = useDispatch();
  const {
    match: {
      params: {
        unitId: routeUnitId,
        courseId: routeCourseId,
      },
    },
  } = props;

  useEffect(() => {
    dispatch(fetchCourse(routeCourseId));
  }, [routeCourseId, dispatch]);

  useEffect(() => {
    // Descomente una condicional en CoursePlayer que envolvia a Sequence
    if (sequenceIds.length > 0) {
      sequenceIds.forEach(sequenceId => dispatch(fetchSequence(sequenceId)));
    }
  }, [sequenceIds, dispatch]);

  return (
    <>
      <div className={classNames(
        'cv-course-content',
        { 'cv-course-content-sidebar-extended': isSidebarExtended },
      )}
      >
        <CoursePlayer {...props} />
      </div>
      <div className={classNames(
        'cv-course-sidebar',
        { 'cv-course-sidebar-extended': isSidebarExtended },
        { 'cv-course-sidebar-mobile-closed': isMobileSidebarClosed },
      )}
      >
        <DummySidebar currentUnitId={routeUnitId} courseId={routeCourseId} />
      </div>
    </>
  );
};

CourseView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      sequenceId: PropTypes.string,
      unitId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CourseView;
