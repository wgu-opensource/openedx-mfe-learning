import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { sectionSequenceUnitsSelector, currentCourseIdSelector } from '../course-view/data/selectors';
import Section from '../../components/Section/Section';
import CarrotIconLeft from '../../assets/CarrotIconLeft';
import CarrotIconDown from '../../assets/CarrotIcon';
import {
  collapseAllSidebarItems, expandAllSidebarItems, setOpenCollapseSidebarItem, toggleOpenCollapseSidebarItem,
} from './data/slice';
import collapsibleMenuStateSelector from './data/selectors';
import CarrotIconTop from '../../assets/CarrotIconTop';
import { toggleDesktopSidebar } from '../course-view/data/slice';
import CarrotIconRight from '../../assets/CarrotIconRight';
import SimpleLoader from '../../components/SimpleLoader/SimpleLoader';

const Sidebar = ({ currentUnitId, sequenceId, isSidebarExtended }) => {
  const dispatch = useDispatch();
  const courseId = useSelector(currentCourseIdSelector);
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const collapsibleMenuState = useSelector(collapsibleMenuStateSelector);

  const toggle = () => {
    dispatch(toggleDesktopSidebar());
  };

  // isOpen is optional, toggles if not set
  const handleOpenCollapse = (id, isOpen) => {
    if (isOpen != null) {
      dispatch(setOpenCollapseSidebarItem({ id, isOpen }));
      return;
    }
    dispatch(toggleOpenCollapseSidebarItem({ id }));
  };

  const scrollToCurrentUnit = () => {
    const currentUnit = document.querySelector('.sidebar-item-header.current');
    if (currentUnit !== null && 'scrollIntoView' in currentUnit) {
      setTimeout(() => currentUnit.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' }), 0);
    }
  };

  const handleCollapseAll = () => dispatch(collapseAllSidebarItems());

  const handleExpandAll = () => {
    dispatch(expandAllSidebarItems());
    scrollToCurrentUnit();
  };

  const handleSidebarContentClick = () => {
    if (isSidebarExtended) {
      return;
    }
    toggle();
  };

  useEffect(() => {
    scrollToCurrentUnit();
  }, [currentUnitId]);

  useEffect(() => {
    const sidebar = document.getElementsByClassName('sidebar-container')[0];
    const focusableElements = sidebar.querySelectorAll('button:not(.collapsed button):not(button[tabindex="-1"])');
    function focusNextElement(currentElement) {
      const currentIndex = Array.from(focusableElements).indexOf(currentElement);
      if (currentIndex === -1) {
        focusableElements[0].focus();
      }
      if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
        focusableElements[currentIndex + 1].focus();
      }
    }

    function focusPreviousElement(currentElement) {
      const currentIndex = Array.from(focusableElements).indexOf(currentElement);
      if (currentIndex === -1) {
        focusableElements[0].focus();
      }
      if (currentIndex > 0) {
        focusableElements[currentIndex - 1].focus();
      }
    }

    function handleKeydownEvent(event) {
      if (event.key === 'ArrowDown') {
        focusNextElement(document.activeElement);
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        focusPreviousElement(document.activeElement);
        event.preventDefault();
      }
    }
    sidebar.addEventListener('keydown', handleKeydownEvent);
    return () => sidebar.removeEventListener('keydown', handleKeydownEvent);
  }, [sectionSequenceUnits.length, collapsibleMenuState, isSidebarExtended]);

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button className="btn-outline-secondary" tabIndex={isSidebarExtended ? 0 : -1} data-testid="expand-all-button" type="button" onClick={handleExpandAll}><CarrotIconDown />Expand All</button>
        <button className="btn-outline-secondary" tabIndex={isSidebarExtended ? 0 : -1} data-testid="collapse-all-button" type="button" onClick={handleCollapseAll}><CarrotIconTop />Collapse All</button>
        <button type="button" onClick={toggle}>{isSidebarExtended ? <CarrotIconLeft /> : <CarrotIconRight />}</button>
      </div>
      <div role="button" tabIndex={-1} className="sidebar-content" onClick={handleSidebarContentClick} onKeyDown={() => {}}>
        <div className="white-background">
          {!sectionSequenceUnits?.length && <SimpleLoader />}
          {sectionSequenceUnits?.map(section => (
            <Section
              key={section.id}
              collapsibleMenuState={collapsibleMenuState}
              courseId={courseId}
              currentUnitId={currentUnitId}
              id={section.id}
              title={section.title}
              status={section.status}
              sequences={section.sequences}
              onOpenCollapse={handleOpenCollapse}
              isActiveSection={section.sequences.some(sequence => sequence.id === sequenceId)}
              currentSequenceId={sequenceId}
            />
          ))}
        </div>
      </div>
      {/* <button type="button" onClick={toggle}>Toggle</button> */}
    </div>
  );
};

Sidebar.propTypes = {
  currentUnitId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  isSidebarExtended: PropTypes.bool.isRequired,
};

export default Sidebar;
