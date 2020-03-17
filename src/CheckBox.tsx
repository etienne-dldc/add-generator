import React from 'react';

interface Props {
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
}

const Check: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-check"
      viewBox="0 0 24 24"
    >
      <path d="M20 6L9 17 4 12"></path>
    </svg>
  );
};

export const CheckBox: React.FC<Props> = ({ value, onChange, label }) => {
  return (
    <div className="CheckBox">
      <label>
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        <span className={value ? 'active' : ''}>{value ? <Check /> : null}</span>
        {label}
      </label>
    </div>
  );
};
