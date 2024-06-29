import { useState } from 'react';

type Option = {
  id: string;
  label: string;
};

interface Props {
  id: string;
  label: string;
  optionList: Option[];
  selectedId: string;
  collapsible?: boolean;
  onSelect: (selectedId: string) => void;
}

function OptionSelect({ id, collapsible = true, label, optionList, selectedId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const getSelected = (options: Option[], selectedId: string) => {
    const selected = options.filter(function (option) {
      return option.id == selectedId;
    })[0];
    return selected ? selected.label : 'Not Selected';
  };
  return (
    <section>
      <div>
        <small>{label}</small>
        <small>
          {collapsible ? (
            <>
              {' > '}
              <a
                href="#"
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                {expanded ? <span>dismiss</span> : <span>{getSelected(optionList, selectedId)}</span>}
              </a>
            </>
          ) : (
            <></>
          )}
        </small>
      </div>
      {expanded || !collapsible ? (
        <div>
          {optionList.map((option) => (
            <label key={option.id} htmlFor={`${id}-select-${option.id}`} style={{ display: 'block' }}>
              <input
                id={`${id}-select-${option.id}`}
                type="radio"
                name={`${id}-select`}
                value={option.id}
                checked={option.id == selectedId}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelect(option.id);
                    setExpanded(false);
                  }
                  //   console.log(event);
                }}
              />
              &nbsp;
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export default OptionSelect;
