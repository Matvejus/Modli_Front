'use client';

import React, { useState, useEffect } from 'react';





export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch(
        'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=1'
      );
      let result = await response.json();
      setData(result.data); // 'data' contains the array with the relevant information
    };
    fetchData();
  }, []);

  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>
          <strong>Record Date:</strong> {item.record_date}<br />
          <strong>Total Public Debt Outstanding:</strong> ${item.tot_pub_debt_out_amt}<br />
        </li>
      ))}
    </ul>
  );
}