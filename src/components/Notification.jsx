import React, { useEffect, useState } from "react";

const Notification = ({ type, message, visible }) => {
  // El tipo puede ser 'success', 'warning', 'error'
  let className = "notificacion";
  if (type === "success") className += " notificacion-success";
  if (type === "warning") className += " notificacion-warning";
  if (type === "error") className += " notificacion-error";
  if (visible) className += " visible";
  let iconClass = "";
  if (type === "success") iconClass = "fas fa-check-circle";
  else if (type === "warning") iconClass = "fas fa-exclamation-triangle";
  else if (type === "error") iconClass = "fas fa-times-circle";
  return (
    <div className={className} role="alert" aria-live="assertive">
      <i className={iconClass} style={{ marginRight: 8 }}></i>
      <span>{message}</span>
    </div>
  );
};

export default Notification; 