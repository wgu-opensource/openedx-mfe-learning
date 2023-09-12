import PropTypes from 'prop-types';
import CarrotIconDown from '../../assets/CarrotIcon';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';
import Sequence from '../Sequence/Sequence';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Section = ({
  currentUnitId, collapsibleMenuState = {}, id, title, status = 'pending', sequences = [], onOpenCollapse,
}) => (
  <div className="sidebar-item-container">
    <button data-testid={`section-button-${id}`} type="button" className="sidebar-item-header" onClick={() => onOpenCollapse(id)}>{collapsibleMenuState[id] ? <CarrotIconDown className="carrot" /> : <CarrotIconRight className="carrot" />} {title} {statusIcons[status]}</button>
    <div data-testid={`section-collapsable-${id}`} className={`sidebar-item-collapsable ${!collapsibleMenuState[id] && 'collapsed'}`}>
      {sequences.map(sequence => (
        <Sequence
          key={sequence.id}
          collapsibleMenuState={collapsibleMenuState}
          status={sequence.status}
          currentUnitId={currentUnitId}
          id={sequence.id}
          title={sequence.title}
          units={sequence.units}
          onOpenCollapse={onOpenCollapse}
        />
      ))}
    </div>
  </div>
);

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  sequences: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    collapsibleMenuState: PropTypes.objectOf(PropTypes.bool),
    title: PropTypes.string.isRequired,
  })).isRequired,
  onOpenCollapse: PropTypes.func.isRequired,
  collapsibleMenuState: PropTypes.objectOf(PropTypes.bool).isRequired,
  currentUnitId: PropTypes.string.isRequired,
};

export default Section;
