import PropTypes from 'prop-types';
import { history } from '@edx/frontend-platform';
import classNames from 'classnames';
import CompletedIcon from '../../assets/CompletedIcon';
import PendingIcon from '../../assets/PendingIcon';

const statusIcons = {
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Unit = ({
  id, sequenceId, title, complete, isCurrentUnit, isActiveUnit,
}) => {
  const status = complete ? 'completed' : 'pending';

  return (
    <button type="button" className="sidebar-item-container" onClick={() => history.push(`/course/course-v1:edX+DemoX+Demo_Course/${sequenceId}/${id}`)}>
      <div className={classNames('sidebar-item-header', {
        current: isCurrentUnit,
        active: isActiveUnit,
      }, status, 'unit')}
      > <span className="sidebar-item-title">{title}</span> {statusIcons[status]}
      </div>
    </button>
  );
};

Unit.propTypes = {
  id: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  isCurrentUnit: PropTypes.bool.isRequired,
  isActiveUnit: PropTypes.bool.isRequired,
};

export default Unit;
