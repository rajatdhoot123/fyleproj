import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "MUMBAI", label: "MUMBAI" },
  { value: "PUNE", label: "PUNE" },
  { value: "BANGALORE", label: "BANGALORE" },
  { value: "CHENNAI", label: "CHENNAI" }
];

const DropDown = ({ setData }) => {
  const [selectedOption, handleSelection] = useState({
    value: "MUMBAI",
    label: "MUMBAI"
  });

  useEffect(() => {
    setData(prevData => ({ ...prevData, city: selectedOption.value }));
  }, [selectedOption]);
  return (
    <Select
      value={selectedOption}
      onChange={handleSelection}
      options={options}
    />
  );
};

export default DropDown;
