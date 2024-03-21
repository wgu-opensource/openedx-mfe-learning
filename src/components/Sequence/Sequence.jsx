import PropTypes from 'prop-types';
import classNames from 'classnames';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { history } from '@edx/frontend-platform';
import { useDispatch } from 'react-redux';

import CarrotIconDown from '../../assets/CarrotIcon';
import CarrotIconRight from '../../assets/CarrotIconRight';
import CompletedIcon from '../../assets/CompletedIcon';
import InProgressIcon from '../../assets/InProgressIcon';
import PendingIcon from '../../assets/PendingIcon';
import Unit from '../Unit/Unit';
import { closeMobileSidebar } from '../../features/course-view/data/slice';

const statusIcons = {
  'in-progress': <InProgressIcon />,
  pending: <PendingIcon />,
  completed: <CompletedIcon />,
};

const Sequence = ({
  id, title, status = 'pending', units = [], onOpenCollapse, collapsibleMenuState = {}, currentUnitId, isActiveSequence, hasCurrentUnit, sectionId, courseId,
}) => {
  const handleOpenCollapse = () => onOpenCollapse(id);
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
    logEvent('edx.ui.lms.outline.selected', 'accordion', title, `/course/${courseId}/${id}`);
    // Navigate
    history.push(`/course/${courseId}/${id}`);
    // Close sidebar
    dispatch(closeMobileSidebar);
  };

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
        aria-expanded={collapsibleMenuState[id]}
        onClick={units.length ? handleOpenCollapse : handleClick}
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
  units: PropTypes.array.isRequired, // eslint-disable-line
  onOpenCollapse: PropTypes.func.isRequired,
  collapsibleMenuState: PropTypes.objectOf(PropTypes.bool).isRequired,
  courseId: PropTypes.string.isRequired,
  currentUnitId: PropTypes.string.isRequired,
  isActiveSequence: PropTypes.bool.isRequired,
  hasCurrentUnit: PropTypes.bool.isRequired,
  sectionId: PropTypes.string.isRequired,
};

export default Sequence;
