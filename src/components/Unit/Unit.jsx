import PropTypes from 'prop-types';
import { history } from '@edx/frontend-platform';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Unit = ({
  id, sequenceId, title, complete, isCurrentUnit,
}) => {
  const getStatus = () => {
    if (complete) {
      return 'completed';
    }
    if (isCurrentUnit) {
      return 'in-progress';
    }

    return 'pending';
  };

  return (
    <button type="button" className="sidebar-item-container" onClick={() => history.push(`/course/course-v1:edX+DemoX+Demo_Course/${sequenceId}/${id}`)}>
      <div className={`sidebar-item-header unit ${isCurrentUnit && 'current'}`}> {title} {statusIcons[getStatus()]}</div>
    </button>
  );
};

Unit.propTypes = {
  id: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  isCurrentUnit: PropTypes.bool.isRequired,
};

export default Unit;