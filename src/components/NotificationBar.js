import React from 'react';
import PropTypes from 'prop-types';
import '../styles/NotificationBar.css';

const NotificationBar = ({ message, type = 'success' }) => {
  return message ? (
    <div className={`notification-bar ${type === 'error' ? 'error' : 'success'}`}>
      {message}
    </div>
  ) : null;
};

NotificationBar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success']),
};

export default NotificationBar;
