import PropTypes from 'prop-types';
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
  id, title, status = 'pending', units = [], onOpenCollapse, sidebarItems = {}, currentUnitId,
}) => (
  <div className="sidebar-item-container">
    <button type="button" className="sidebar-item-header sequence" onClick={() => onOpenCollapse(id, 'sequence')}>{units.length > 0 && (sidebarItems[id] ? <CarrotIconDown className="carrot" /> : <CarrotIconRight className="carrot" />)} {title} {statusIcons[status]}</button>
    <div className={`sidebar-item-collapsable ${!sidebarItems[id] && 'collapsed'}`}>
      {units.map(unit => (
        <Unit
          key={unit.id}
          complete={unit.complete}
          id={unit.id}
          sequenceId={id}
          title={unit.title}
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
  sidebarItems: PropTypes.objectOf(PropTypes.bool).isRequired,
  currentUnitId: PropTypes.string.isRequired,
};

export default Sequence;
