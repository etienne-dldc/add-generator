import React from 'react';
import { Reason } from './generateDocument';

interface ReasonObj {
  name: Reason;
  label: string;
}

const REASONS: Array<ReasonObj> = [
  {
    name: 'work',
    label: 'Travail'
  },
  {
    name: 'food',
    label: 'Courses'
  },
  {
    name: 'family',
    label: 'Famille'
  },
  {
    name: 'health',
    label: 'Santé'
  },
  {
    name: 'workout',
    label: 'Activité Physique'
  }
];

interface Props {
  reason: Reason | null;
  onChange: (value: Reason) => void;
  label: string;
}

export const ReasonChoice: React.FC<Props> = ({ reason, onChange, label }) => {
  return (
    <div className="ReasonChoice">
      <p className="label">{label}</p>
      <div className="ReasonChoice--items">
        {REASONS.map(r => {
          return (
            <label
              className={'ReasonChoice--item ' + (reason === r.name ? 'active' : '')}
              key={r.name}
            >
              <input
                type="radio"
                name="reason"
                value={r.name}
                checked={reason === r.name}
                onChange={e => onChange(e.target.value as any)}
              />
              <span className="ReasonChoice--box" />
              {r.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};
