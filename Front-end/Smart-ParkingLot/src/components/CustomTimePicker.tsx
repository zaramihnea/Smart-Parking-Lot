import React from 'react';
import TimePicker from 'react-time-picker';
import './CustomTimePicker.css';

interface CustomTimePickerProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="time-picker-container">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <TimePicker
        className="custom-time-picker"
        value={value}
        onChange={onChange}
        disableClock={true}
        clearIcon={null}
        clockIcon={null}
      />
    </div>
  );
};

export default CustomTimePicker;