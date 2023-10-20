import PropTypes from 'prop-types';
import { history } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import CompletedIcon from '../../assets/CompletedIcon';
import PendingIcon from '../../assets/PendingIcon';
import { closeMobileSidebar, toggleDesktopSidebar } from '../../features/course-view/data/slice';
import { isDesktopSidebarExtendedSelector } from '../../features/course-view/data/selectors';

const statusIcons = {
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Unit = ({
  id, courseId, sequenceId, title, complete, isCurrentUnit, isActiveUnit,
}) => {
  const status = complete ? 'completed' : 'pending';
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);

  const dispatch = useDispatch();

  const handleClick = () => {
    // Navigate
    history.push(`/course/${courseId}/${sequenceId}/${id}`);
    // Close sidebar on mobile
    dispatch(closeMobileSidebar());
    // Extend sidebar on desktop
    if (!isSidebarExtended) {
      dispatch(toggleDesktopSidebar());
    }
  };

  return (
    <button role="menuitem" type="button" className="sidebar-item-container" data-testid={`unit-button-${id}`} onClick={handleClick}>
      <div
        role="none"
        className={classNames('sidebar-item-header', {
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
