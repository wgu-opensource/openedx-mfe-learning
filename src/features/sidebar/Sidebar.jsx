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
import { closeDesktopSidebar, toggleDesktopSidebar } from '../course-view/data/slice';
import CarrotIconRight from '../../assets/CarrotIconRight';
import SimpleLoader from '../../components/SimpleLoader/SimpleLoader';

const ConditionalButton = ({
  isSidebarExtended, onClick, dataTestId, children, ariaLabel,
}) => (
  <button
    className="btn-outline-secondary"
    data-testid={dataTestId}
    type="button"
    onClick={onClick}
    disabled={!isSidebarExtended}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const Sidebar = ({ currentUnitId, sequenceId, isSidebarExtended }) => {
  const dispatch = useDispatch();
  const courseId = useSelector(currentCourseIdSelector);
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const collapsibleMenuState = useSelector(collapsibleMenuStateSelector);

  const toggle = () => {
    dispatch(toggleDesktopSidebar());
  };

  const handleSidebarContentClick = () => {
    if (isSidebarExtended) {
      return;
    }
    toggle();
  };

  // isOpen is optional, toggles if not set
  const handleOpenCollapse = (id, isOpen) => {
    if (isOpen != null) {
      dispatch(setOpenCollapseSidebarItem({ id, isOpen }));
      return;
    }
    dispatch(toggleOpenCollapseSidebarItem({ id }));

    // Extend sidebar if collapsed while on desktop
    handleSidebarContentClick();
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
      } else if (event.key === 'Escape') {
        document.body.tabIndex = -1;
        document.body.focus();
        document.body.removeAttribute('tabindex');
        dispatch(closeDesktopSidebar());
      }
    }
    sidebar.addEventListener('keydown', handleKeydownEvent);
    return () => sidebar.removeEventListener('keydown', handleKeydownEvent);
  }, [sectionSequenceUnits.length, collapsibleMenuState, isSidebarExtended, dispatch]);

  return (
    <div className="sidebar-container" role="menu">
      <div className="sidebar-header">
        <ConditionalButton
          isSidebarExtended={isSidebarExtended}
          onClick={handleExpandAll}
          dataTestId="expand-all-button"
          ariaLabel="Expand All"
        >
          <CarrotIconDown /> Expand All
        </ConditionalButton>
        <ConditionalButton
          isSidebarExtended={isSidebarExtended}
          onClick={handleCollapseAll}
          dataTestId="collapse-all-button"
          ariaLabel="Collapse All"
        >
          <CarrotIconTop /> Collapse All
        </ConditionalButton>
        <button type="button" onClick={toggle} aria-label="Toggle Sidebar">
          {isSidebarExtended ? <CarrotIconLeft /> : <CarrotIconRight />}
        </button>
      </div>
      <div className="sidebar-content">
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
    </div>
  );
};

ConditionalButton.propTypes = {
  isSidebarExtended: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  dataTestId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

Sidebar.propTypes = {
  currentUnitId: PropTypes.string,
  sequenceId: PropTypes.string.isRequired,
  isSidebarExtended: PropTypes.bool.isRequired,
};

Sidebar.defaultProps = {
  currentUnitId: null,
};

export default Sidebar;
