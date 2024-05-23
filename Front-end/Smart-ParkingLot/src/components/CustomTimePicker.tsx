import React from 'react';
import './CustomTimePicker.css';

interface CustomTimePickerProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="time-picker-container">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="time"
        className="custom-time-picker"
        value={value || ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default CustomTimePicker;
