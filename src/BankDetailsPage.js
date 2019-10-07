import React from "react";
import "./BankDetails.css";

const BankDetails = ({ selectedBank, handleView }) => {
  return (
    <div className="mt100">
      <div className="textCenter">Bank Details</div>
      {Object.entries(selectedBank).map(details => (
        <div className="details">
          <div className="mx1">
            <strong>{details[0]}</strong>
          </div>
          <div className="mx1">{details[1]}</div>
        </div>
      ))}
      <div className="buttonCenter">
        <button class="btn default" onClick={() => handleView(1)}>Back</button>
      </div>
    </div>
  );
};

export default BankDetails;
