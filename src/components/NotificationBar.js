import React from 'react';

function NotificationBar({ message, type }) {
    const barStyle = {
        padding: '10px',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: type === 'error' ? 'red' : 'green',
        position: 'fixed',
        top: 0,
        left: 0,  /* 让通知栏从左到右占满宽度 */
        width: '100%',  /* 确保通知栏占满整个宽度 */
        zIndex: 1000,  /* 确保通知栏位于页面顶部 */
    };

    return message ? <div style={barStyle}>{message}</div> : null;
}

export default NotificationBar;

