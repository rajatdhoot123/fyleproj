import React, { useEffect, useState, useRef } from "react";
import DropDown from "./CityDropDown";
import SearchBox from "./Search";
import "./BankPage.css";
import axios from "axios";
import Select from "react-select";
import BankDetailsPage from "./BankDetailsPage";
const PageSize = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" }
];

const PaginationInitial = {
  currentPage: 1,
  lowerBound: 0,
  upperBound: 10,
  pageSize: 10
};

const BankPage = () => {
  const [bankData, setData] = useState({
    city: null,
    bankDetails: [],
    searchResult: [],
    pageSize: 10,
    fav: []
  });
  const [pagination, setPagination] = useState(PaginationInitial);
  const [view, setView] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBank, handleSelectedBank] = useState({});

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    localStorage.setItem(`fylefavBanks`, JSON.stringify(bankData.fav));
  }, [bankData.fav]);

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      fav: JSON.parse(localStorage.getItem(`fylefavBanks`) || "[]")
    }));
  }, []);

  useEffect(() => {
    if (bankData.city) {
      setPagination(PaginationInitial);
      if (localStorage.getItem(`fyle${bankData.city}`)) {
        setData(prevData => ({
          ...prevData,
          bankDetails: JSON.parse(localStorage.getItem(`fyle${bankData.city}`)),
          searchResult: []
        }));
      } else {
        setLoading(true);
        axios
          .get(
            `https://vast-shore-74260.herokuapp.com/banks?city=${bankData.city}`
          )
          .then(({ data = [] }) => {
            setLoading(false);
            localStorage.setItem(`fyle${bankData.city}`, JSON.stringify(data));
            setData(prevData => ({
              ...prevData,
              bankDetails: data,
              searchResult: []
            }));
          })
          .catch(err => {
            setLoading(false);
            console.warn({ err });
          });
      }
    }
  }, [bankData.city]);

  const handleView = view => {
    setView(view);
  };

  if (view === 3) {
    return <BankDetailsPage handleView={handleView} selectedBank={selectedBank} />;
  }
  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          className={view === 1 ? "tabs tab-active" : "tabs"}
          onClick={handleView.bind(null, 1)}
        >
          Banks
        </div>
        <div
          className={view === 2 ? "tabs tab-active" : "tabs"}
          onClick={handleView.bind(null, 2)}
        >
          Fav Banks
        </div>
      </div>
      <>
        {view === 1 && (
          <div style={{ display: "flex" }}>
            <div style={{ width: "30%" }}>
              <DropDown setData={setData} />
            </div>
            <div style={{ width: "70%" }}>
              <SearchBox bankDetails={bankData.bankDetails} setData={setData} />
            </div>
          </div>
        )}
        <BankTable
          handleSelectedBank={handleSelectedBank}
          setView={setView}
          setData={setData}
          pagination={pagination}
          fav={bankData.fav}
          view={view}
          searchResult={bankData.searchResult}
          data={bankData.bankDetails}
          loading={loading}
        />
        {view === 1 && (
          <Pagination
            pageSize={pagination.pageSize}
            setPagination={setPagination}
            dataLength={
              bankData.searchResult.length || bankData.bankDetails.length
            }
          />
        )}
      </>
    </>
  );
};

const BankTable = ({
  handleSelectedBank,
  setView,
  fav,
  view,
  data,
  loading,
  searchResult = [],
  pagination = {},
  setData
}) => {
  const makeFav = (detail, view, event) => {
    event.stopPropagation()
    if (view === 1) {
      setData(prevData => ({
        ...prevData,
        fav: [...new Set([...prevData.fav, detail])]
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        fav: [
          ...prevData.fav.slice(
            0,
            prevData.fav.findIndex(ele => ele.ifsc === detail.ifsc)
          ),
          ...prevData.fav.slice(
            prevData.fav.findIndex(ele => ele.ifsc === detail.ifsc) + 1
          )
        ] // prevData.fav.findIndex(ele => ele.ifsc === detail.ifsc)
      }));
    }
  };

  const showBankDetails = bankDetails => {
    setView(3);
    handleSelectedBank(bankDetails)
  };

  const getBankTable = bankDetails => {
    let result = [];
    for (
      let i = pagination.lowerBound;
      i < Math.min(bankDetails.length, pagination.upperBound);
      i++
    ) {
      if (!bankDetails[i].ifsc) {
        return null;
      }
      result.push(
        <tr
          className="cursor"
          key={bankDetails[i].ifsc}
          onClick={showBankDetails.bind(null, bankDetails[i])}
        >
          <td onClick={makeFav.bind(null, bankDetails[i], view)}>
            {view === 1 ? "Add" : "Remove"}
          </td>
          <td>{bankDetails[i].ifsc}</td>
          <td>{bankDetails[i].bank_id}</td>
          <td>{bankDetails[i].branch}</td>
          <td>{bankDetails[i].address}</td>
          <td>{bankDetails[i].city}</td>
          <td>{bankDetails[i].district}</td>
          <td>{bankDetails[i].state}</td>
          <td>{bankDetails[i].bank_name}</td>
        </tr>
      );
    }
    return result;
  };
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table>
          <tbody>
            <tr>
              <th>Add Fav</th>
              <th>ifsc</th>
              <th>bank_id</th>
              <th>branch</th>
              <th>address</th>
              <th>city</th>
              <th>district</th>
              <th>state</th>
              <th>bank_name</th>
            </tr>
            {loading ? (
              <div>Loading</div>
            ) : (
              getBankTable(
                view === 2 ? fav : searchResult.length ? searchResult : data
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Pagination = ({ dataLength, setPagination, pageSize }) => {
  const [selectedOption, handleSelection] = useState({
    value: "10",
    label: "10"
  });

  useEffect(() => {
    setPagination(prevData => ({
      ...prevData,
      pageSize: Number(selectedOption.value),
      upperBound: Number(selectedOption.value),
      currentPage: 1,
      lowerBound: 0
    }));
  }, [selectedOption]);

  const getCount = max => {
    let count = 0;
    let countElement = [];
    while (count < max / pageSize) {
      count++;
      countElement.push(
        <div key={count} className="child" data-count={count}>
          {count}
        </div>
      );
    }
    return countElement;
  };

  const handlePagination = event => {
    const target = event.target;
    if (target && target.dataset && target.dataset.count) {
      setPagination(prevData => ({
        ...prevData,
        upperBound: Number(target.dataset.count) * pageSize,
        lowerBound: (Number(target.dataset.count) - 1) * pageSize,
        currentPage: Number(target.dataset.count)
      }));
    }
  };
  return (
    <>
      <div className="my-2">
        <div>Select Page Size</div>
        <Select
          value={selectedOption}
          onChange={handleSelection}
          options={PageSize}
        />
      </div>
      <div className="wrapper">
        <div className="scrolls" onClick={handlePagination}>
          {getCount(dataLength)}
        </div>
      </div>
    </>
  );
};

export default BankPage;
