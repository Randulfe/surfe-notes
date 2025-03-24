export interface Option {
  value: string;
  label?: string;
}

export interface SelectProps {
  options: Option[];
  selectedOption: Option;
  onChange: (value: Option) => void;
}

export const Select = ({ options, selectedOption, onChange }: SelectProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );
    if (!selectedOption) return;
    onChange(selectedOption);
  };
  return (
    <select
      id="countries"
      className="text-primary text-md focus:border-primary focus:ring-primary block w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50 p-2 focus:outline-none"
      onChange={handleChange}
    >
      {options.map((option) => (
        <option
          selected={option.value === selectedOption.value}
          key={option.value}
          value={option.value}
        >
          {option?.label ?? option.value}
        </option>
      ))}
    </select>
  );
};
