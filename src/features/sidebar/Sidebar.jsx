import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sectionSequenceUnitsSelector, currentCourseIdSelector } from '../course-view/data/selectors';
import Section from '../../components/Section/Section';
import CarrotIconLeft from '../../assets/CarrotIconLeft';
import CarrotIconDown from '../../assets/CarrotIcon';
import { collapseAllSidebarItems, expandAllSidebarItems, toggleOpenCollapseSidebarItem } from './data/slice';
import collapsibleMenuStateSelector from './data/selectors';
import CarrotIconTop from '../../assets/CarrotIconTop';
import { toggleDesktopSidebar } from '../course-view/data/slice';
import CarrotIconRight from '../../assets/CarrotIconRight';

const Sidebar = ({ currentUnitId, sequenceId, isSidebarExtended }) => {
  const dispatch = useDispatch();
  const courseId = useSelector(currentCourseIdSelector);
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const collapsibleMenuState = useSelector(collapsibleMenuStateSelector);

  const toggle = () => {
    dispatch(toggleDesktopSidebar());
  };

  const handleOpenCollapse = (id) => {
    dispatch(toggleOpenCollapseSidebarItem({ id }));
  };

  const handleCollapseAll = () => dispatch(collapseAllSidebarItems());

  const handleExpandAll = () => dispatch(expandAllSidebarItems());

  const handleSidebarContentClick = () => {
    if (isSidebarExtended) {
      return;
    }
    toggle();
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button data-testid="collapse-all-button" type="button" onClick={handleExpandAll}><CarrotIconDown />Expand All</button>
        <button data-testid="expand-all-button" type="button" onClick={handleCollapseAll}><CarrotIconTop />Collapse All</button>
        {isSidebarExtended ? <CarrotIconLeft onClick={toggle} /> : <CarrotIconRight onClick={toggle} />}
      </div>
      <button type="button" className="sidebar-content" onClick={handleSidebarContentClick}>
        <div className="white-background">
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
      </button>
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
