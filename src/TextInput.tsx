import React from 'react';
import cuid from 'cuid';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  name: string;
}

export const TextInput: React.FC<Props> = ({ value, onChange, name, placeholder, label }) => {
  const [id] = React.useState(cuid.slug);

  return (
    <div className="TextInput">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        className="TextInput--input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};
