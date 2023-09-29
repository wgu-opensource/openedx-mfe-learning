import PropTypes from 'prop-types';
import { history } from '@edx/frontend-platform';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import CompletedIcon from '../../assets/CompletedIcon';
import PendingIcon from '../../assets/PendingIcon';
import { closeMobileSidebar } from '../../features/course-view/data/slice';

const statusIcons = {
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Unit = ({
  id, courseId, sequenceId, title, complete, isCurrentUnit, isActiveUnit,
}) => {
  const status = complete ? 'completed' : 'pending';

  const dispatch = useDispatch();

  const handleClick = () => {
    // Navigate
    history.push(`/course/${courseId}/${sequenceId}/${id}`);
    // Close sidebar
    dispatch(closeMobileSidebar());
  };

  return (
    <button type="button" className="sidebar-item-container" onClick={handleClick}>
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
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  isCurrentUnit: PropTypes.bool.isRequired,
  isActiveUnit: PropTypes.bool.isRequired,
};

export default Unit;
