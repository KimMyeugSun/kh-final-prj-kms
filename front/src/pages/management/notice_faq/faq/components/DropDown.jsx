import {
  Autocomplete,
  TextField,
} from '@mui/material';
import { useState } from 'react';

const DropDown = ({
  defaultLabel = 'FAQ Category',
  items,
  onSelect,
  initialValue = null,
}) => {
  const [selected, setSelected] = useState(initialValue); 

  const handleChange = (e, value) => {
    setSelected(value);
    onSelect(value);
  };

  const renderOption = (params) => {
    return <TextField {...params} label={defaultLabel} />;
  };

  return (
    <Autocomplete
      disablePortal
      options={items}
      value={selected}
      sx={{ width: 300 }}
      size="small"
      renderInput={renderOption}
      onChange={handleChange}
    />
  );
};

export default DropDown;
