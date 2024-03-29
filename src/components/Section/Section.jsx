import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import CarrotIconDown from '../../assets/CarrotIcon';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';
import Sequence from '../Sequence/Sequence';
import SmallLoader from '../SmallLoader/SmallLoader';
import { currentSequenceSelector } from '../../features/course-player/data/selectors';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Section = ({
  currentUnitId, collapsibleMenuState = {}, id, title, status = 'pending', sequences = [], onOpenCollapse, isActiveSection, currentSequenceId, courseId,
}) => {
  const currentSequence = useSelector(currentSequenceSelector);
  const hasCurrentUnit = currentSequence.sectionId === id;
  const isLoading = sequences.length === 0;

  const handleOpenCollapse = () => onOpenCollapse(id);
  const handleOpenCollapseCurrentSequence = () => {
    onOpenCollapse(id, true);
    onOpenCollapse(currentSequenceId, true);
  };

  return (
    <div className="sidebar-item-container">
      <button
        data-testid={`section-button-${id}`}
        type="button"
        className={classNames('sidebar-item-header', { active: isActiveSection, 'has-current-unit': hasCurrentUnit && !collapsibleMenuState[id] }, status, 'section')}
        onClick={handleOpenCollapse}
        aria-expanded={collapsibleMenuState[id]}
      >{collapsibleMenuState[id] ? <CarrotIconDown className="carrot-down" /> : <CarrotIconRight className="carrot" />} <span className="sidebar-item-title">{title}</span>
        { isLoading && collapsibleMenuState[id] ? <SmallLoader /> : statusIcons[status] }
      </button>
      <button
        type="button"
        className={classNames('current-unit-flag', { visible: hasCurrentUnit && !collapsibleMenuState[id] })}
        onClick={handleOpenCollapseCurrentSequence}
        aria-label="Bookmark"
        tabIndex={hasCurrentUnit && !collapsibleMenuState[id] ? 0 : -1}
      />
      <div role="group" data-testid={`section-collapsable-${id}`} className={`sidebar-item-collapsable ${!collapsibleMenuState[id] && 'collapsed'}`}>
        {sequences.map(sequence => (
          <Sequence
            key={sequence.id}
            courseId={courseId}
            collapsibleMenuState={collapsibleMenuState}
            status={sequence.status}
            currentUnitId={currentUnitId}
            isActiveSequence={isActiveSection}
            id={sequence.id}
            title={sequence.title}
            units={sequence.units}
            onOpenCollapse={onOpenCollapse}
            hasCurrentUnit={currentSequenceId === sequence.id}
            sectionId={id}
          />
        ))}
      </div>
    </div>
  );
};

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  sequences: PropTypes.arrayOf(PropTypes.shape({
    units: PropTypes.array.isRequired, // eslint-disable-line
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    collapsibleMenuState: PropTypes.objectOf(PropTypes.bool),
    title: PropTypes.string.isRequired,
  })).isRequired,
  onOpenCollapse: PropTypes.func.isRequired,
  collapsibleMenuState: PropTypes.objectOf(PropTypes.bool).isRequired,
  courseId: PropTypes.string.isRequired,
  currentUnitId: PropTypes.string.isRequired,
  isActiveSection: PropTypes.bool.isRequired,
  currentSequenceId: PropTypes.string.isRequired,
};

export default Section;
