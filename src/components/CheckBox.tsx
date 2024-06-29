// import React from 'react';

interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckBox({ id, label, checked, onChange }: Props) {
  return (
    <label htmlFor={`${id}-check`}>
      <input
        id={`${id}-check`}
        type="checkbox"
        name={`${id}-check`}
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
      {` ${label}`}
    </label>
  );
}

export default CheckBox;
