import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sectionSequenceUnitsSelector } from '../course-view/data/selectors';
import Section from '../../components/Section/Section';
import CarrotIconLeft from '../../assets/CarrotIconLeft';
import CarrotIconDown from '../../assets/CarrotIcon';
import { collapseAllSidebarItems, expandAllSidebarItems, toggleOpenCollapseSidebarItem } from './data/slice';
import collapsibleMenuStateSelector from './data/selectors';
import CarrotIconTop from '../../assets/CarrotIconTop';

const Sidebar = ({ currentUnitId, sequenceId }) => {
  const dispatch = useDispatch();
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const collapsibleMenuState = useSelector(collapsibleMenuStateSelector);

  // const toggle = () => {
  //   dispatch(toggleDesktopSidebar());
  // };

  const handleOpenCollapse = (id) => {
    dispatch(toggleOpenCollapseSidebarItem({ id }));
  };

  const handleCollapseAll = () => dispatch(collapseAllSidebarItems());

  const handleExpandAll = () => dispatch(expandAllSidebarItems());

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button data-testid="collapse-all-button" type="button" onClick={handleExpandAll}><CarrotIconDown />Expand All</button>
        <button data-testid="expand-all-button" type="button" onClick={handleCollapseAll}><CarrotIconTop />Collapse All</button>
        <CarrotIconLeft />
      </div>
      <div className="sidebar-content">
        <div className="white-background">
          {sectionSequenceUnits?.map(section => (
            <Section
              key={section.id}
              collapsibleMenuState={collapsibleMenuState}
              currentUnitId={currentUnitId}
              id={section.id}
              title={section.title}
              status={section.status}
              sequences={section.sequences}
              onOpenCollapse={handleOpenCollapse}
              isActiveSection={section.sequences.some(sequence => sequence.id === sequenceId)}
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
};

export default Sidebar;
