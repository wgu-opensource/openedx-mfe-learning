import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  collapseAllSidebarItems, expandAllSidebarItems, toggleOpenCollapseSidebarItem,
} from '@edx/frontend-app-learning';
import { sectionSequenceUnitsSelector, sidebarItemsSelector } from '../../features/course-view/data/selectors';
import Section from '../Section/Section';
import CarrotIconLeft from '../../assets/CarrotIconLeft';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CarrotIconDown from '../../assets/CarrotIcon';

const Sidebar = ({ currentUnitId }) => {
  const dispatch = useDispatch();
  const sectionSequenceUnits = useSelector(sectionSequenceUnitsSelector);
  const collapsibleMenuState = useSelector(sidebarItemsSelector);
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
    const updatedSectionSequenceUnits = sectionSequenceUnits.map(section => {
      const updatedSection = { ...section };
      updatedSection.status = getSectionStatus(section);

      updatedSection.sequences = section.sequences.map(sequence => {
        const updatedSequence = { ...sequence };
        updatedSequence.status = getSequenceStatus(sequence);
        return updatedSequence;
      });

      return updatedSection;
    });

    setSectionSequenceUnitsWithCollapsible(updatedSectionSequenceUnits);
  }, [sectionSequenceUnits]);

  const handleOpenCollapse = (id) => {
    dispatch(toggleOpenCollapseSidebarItem({ id }));
  };

  const handleCollapseAll = () => dispatch(collapseAllSidebarItems());

  const handleExpandAll = () => dispatch(expandAllSidebarItems());

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button data-testid="collapse-all-button" type="button" onClick={handleCollapseAll}><CarrotIconRight /> ALL</button>
        <button data-testid="expand-all-button" type="button" onClick={handleExpandAll}><CarrotIconDown /> ALL</button>
        <CarrotIconLeft />
      </div>
      <div className="sidebar-content">
        <div className="white-background">
          {sectionSequenceUnitsWithCollapsible?.map(section => (
            <Section
              key={section.id}
              collapsibleMenuState={collapsibleMenuState}
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

Sidebar.propTypes = {
  currentUnitId: PropTypes.string.isRequired,
};

export default Sidebar;
