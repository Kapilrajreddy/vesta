import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexCharts from "react-apexcharts";
import './index.css'

const Hotel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://checkinn.co/api/v1/int/requests"
        );
        setData(response.data.requests);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const totalRequests = data.length;

  const uniqueDepartments = [
    ...new Set(
      data.map((request) => ({ id: request.desk.id, name: request.desk.name }))
    ),
  ];


  console.log(uniqueDepartments, "uniqueDepartments");

  const hotelRequests = data.reduce((acc, request) => {
    acc[request.hotel.shortname] = acc[request.hotel.shortname]
      ? acc[request.hotel.shortname] + 1
      : 1;
    return acc;
  }, {});

  
  const series = Object.keys(hotelRequests).map((hotel) => ({
    x: hotel,
    y: hotelRequests[hotel],
  }));

  return (
    <div className="hotel-graph-main-container">
      <div>
        <ReactApexCharts
          options={{
            chart: {
              type: "line",
              height: 350,
              width: 300,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: Object.keys(hotelRequests),
              labels: {
                formatter: function (val) {
                  return val;
                },
              },
            },
            yaxis: {
              tickAmount: 5,
              min: 0,
            },
          }}
          series={[{ name: "Requests", data: series }]}
          type="line"
          height={400}
        />
        <h2 className="total-requests">Total requests: {totalRequests}</h2>

        <ul className="total-department-list">
          <p className="departement-text">
            List of unique department names across all Hotels:{" "}
          </p>
          {uniqueDepartments.map((department, index) => (
            <>
              <li key={`${department.id * index}`}>{department.name}</li>,
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Hotel;
