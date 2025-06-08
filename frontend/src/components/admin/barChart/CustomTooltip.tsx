import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border rounded-md shadow-md text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
