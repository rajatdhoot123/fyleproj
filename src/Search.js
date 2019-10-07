import React, { useState, useEffect } from "react";
import "./Search.css";

const filterResult = (searchValue, bankDetails) => {
  let filerObj = [];
  for (let i = 0; i < bankDetails.length; i++) {
    let filtered = Object.values(bankDetails[i]).filter(details =>
      ("" + details).toUpperCase().includes(searchValue.toUpperCase())
    );
    if (filtered.length) {
      filerObj.push(bankDetails[i]);
    }
  }
  return filerObj;
};

const SearchBox = ({ bankDetails, setData }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      searchResult: filterResult(searchValue, bankDetails)
    }));
  }, [searchValue]);
  const handleChange = event => {
    let value = event.target.value;
    setSearchValue(value);
  };
  return (
    <div>
      <input
        value={searchValue}
        className="searchBox"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
