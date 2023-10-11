import PropTypes from 'prop-types';
import classNames from 'classnames';
import CarrotIconDown from '../../assets/CarrotIcon';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';
import Unit from '../Unit/Unit';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Sequence = ({
  id, title, status = 'pending', units = [], onOpenCollapse, collapsibleMenuState = {}, currentUnitId, isActiveSequence, hasCurrentUnit, sectionId, courseId,
}) => {
  const handleOpenCollapse = () => onOpenCollapse(id);

  return (
    <div className="sidebar-item-container">
      <button
        data-testid={`sequence-button-${id}`}
        type="button"
        className={classNames(
          'sidebar-item-header',
          {
            active: isActiveSequence,
            'has-current-unit': hasCurrentUnit && collapsibleMenuState[sectionId] && !collapsibleMenuState[id],
          },
          status,
          'sequence',
        )}
        onClick={handleOpenCollapse}
      >
        {units.length > 0 && (collapsibleMenuState[id] ? <CarrotIconDown className="carrot-down" /> : <CarrotIconRight className="carrot" />)}
        <span className="sidebar-item-title">{title}</span>
        {statusIcons[status]}
      </button>
      <button
        type="button"
        className={classNames('current-unit-flag', { visible: hasCurrentUnit && collapsibleMenuState[sectionId] && !collapsibleMenuState[id] })}
        onClick={handleOpenCollapse}
        aria-label="Bookmark"
        tabIndex={hasCurrentUnit && collapsibleMenuState[sectionId] && !collapsibleMenuState[id] ? 0 : -1}
      />
      <div data-testid={`sequence-collapsable-${id}`} className={`sidebar-item-collapsable ${!collapsibleMenuState[id] && 'collapsed'}`}>
        {units.map(unit => (
          <Unit
            key={unit.id}
            courseId={courseId}
            complete={unit.complete}
            id={unit.id}
            sequenceId={id}
            title={unit.title}
            isActiveUnit={isActiveSequence}
            isCurrentUnit={currentUnitId === unit.id}
          />
        ))}
      </div>
    </div>
  );
};

Sequence.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  onOpenCollapse: PropTypes.func.isRequired,
  collapsibleMenuState: PropTypes.objectOf(PropTypes.bool).isRequired,
  courseId: PropTypes.string.isRequired,
  currentUnitId: PropTypes.string.isRequired,
  isActiveSequence: PropTypes.bool.isRequired,
  hasCurrentUnit: PropTypes.bool.isRequired,
  sectionId: PropTypes.string.isRequired,
};

export default Sequence;
