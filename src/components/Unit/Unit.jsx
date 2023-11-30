import PropTypes from 'prop-types';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
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

  const logEvent = (eventName, widgetPlacement, targetUnitTitle, targetUnit) => {
    const currentUrl = window.location.href;
    const courseLocation = currentUrl.indexOf('/course');
    const baseUrl = currentUrl.slice(0, courseLocation);
    const targetUrl = baseUrl + targetUnit;
    const payload = {
      target_name: targetUnitTitle,
      target_url: targetUrl,
      widget_placement: widgetPlacement,
      current_url: currentUrl,
    };
    sendTrackingLogEvent(eventName, payload);
  };

  const handleClick = () => {
    // Log navigation event
    logEvent('edx.ui.lms.outline.selected', 'accordion', title, `/course/${courseId}/${sequenceId}/${id}`);
    // Navigate
    history.push(`/course/${courseId}/${sequenceId}/${id}`);
    // Close sidebar
    dispatch(closeMobileSidebar());
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
