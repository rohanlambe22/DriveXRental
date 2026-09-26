import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { color: 'badge-confirmed', icon: CheckCircle2, label: 'Confirmed' };
      case 'completed':
        return { color: 'badge-completed', icon: CheckCircle2, label: 'Completed' };
      case 'pending':
        return { color: 'badge-pending', icon: Clock, label: 'Pending' };
      case 'cancelled':
        return { color: 'badge-cancelled', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'badge-default', icon: AlertCircle, label: status || 'Unknown' };
    }
  };

  const { color, icon: Icon, label } = getBadgeConfig();

  return (
    <span className={`status-badge ${color}`}>
      <Icon className="status-icon" />
      <span>{label}</span>
    </span>
  );
};
