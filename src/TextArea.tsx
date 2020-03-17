import React from 'react';
import cuid from 'cuid';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
  label: string;
}

export const TextArea: React.FC<Props> = ({ value, onChange, name, placeholder, label }) => {
  const [id] = React.useState(cuid.slug);

  return (
    <div className="TextArea">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea
        id={id}
        className="TextArea--input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};
