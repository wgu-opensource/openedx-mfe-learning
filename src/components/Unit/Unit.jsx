import PropTypes from 'prop-types';
import { history } from '@edx/frontend-platform';
import classNames from 'classnames';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Unit = ({
  id, courseId, sequenceId, title, complete, isCurrentUnit, isActiveUnit,
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
    <button type="button" className="sidebar-item-container" onClick={() => history.push(`/course/${courseId}/${sequenceId}/${id}`)}>
      <div className={classNames('sidebar-item-header', {
        current: isCurrentUnit,
        active: isActiveUnit,
      }, getStatus(), 'unit')}
      > <span className="sidebar-item-title">{title}</span> {statusIcons[getStatus()]}
      </div>
    </button>
  );
};

Unit.propTypes = {
  id: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  isCurrentUnit: PropTypes.bool.isRequired,
  isActiveUnit: PropTypes.bool.isRequired,
};

export default Unit;
