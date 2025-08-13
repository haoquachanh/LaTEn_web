/**
 * MultiSelect Component
 *
 * A reusable component for multiple selection based on MUI
 */
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  maxDisplayed?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, value, onChange, maxDisplayed = 3 }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }) => {
    const selectedValues = event.target.value as (string | number)[];
    onChange(selectedValues);
  };

  // Find label for a value
  const getLabelForValue = (val: string | number): string => {
    const option = options.find((opt) => opt.value === val);
    return option ? option.label : val.toString();
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={`multi-select-${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`multi-select-${label}-label`}
        id={`multi-select-${label}`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected: unknown) => {
          const selectedArray = selected as (string | number)[];
          if (selectedArray.length <= maxDisplayed) {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedArray.map((val) => (
                  <Chip key={val} label={getLabelForValue(val)} size="small" />
                ))}
              </Box>
            );
          }
          return `${selectedArray.length} items selected`;
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
