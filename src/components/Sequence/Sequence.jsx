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
  id, title, status = 'pending', units = [], onOpenCollapse, collapsibleMenuState = {}, currentUnitId, isActiveSequence,
}) => (
  <div className="sidebar-item-container">
    <button data-testid={`sequence-button-${id}`} type="button" className={classNames('sidebar-item-header', { active: isActiveSequence }, status, 'sequence')} onClick={() => onOpenCollapse(id, 'sequence')}>{units.length > 0 && (collapsibleMenuState[id] ? <CarrotIconDown className="carrot-down" /> : <CarrotIconRight className="carrot" />)} <span className="sidebar-item-title">{title}</span> {statusIcons[status]}</button>
    <div data-testid={`sequence-collapsable-${id}`} className={`sidebar-item-collapsable ${!collapsibleMenuState[id] && 'collapsed'}`}>
      {units.map(unit => (
        <Unit
          key={unit.id}
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

Sequence.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  units: PropTypes.string.isRequired,
  onOpenCollapse: PropTypes.func.isRequired,
  collapsibleMenuState: PropTypes.objectOf(PropTypes.bool).isRequired,
  currentUnitId: PropTypes.string.isRequired,
  isActiveSequence: PropTypes.bool.isRequired,
};

export default Sequence;
