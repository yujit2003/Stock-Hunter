"use client"
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
// import Plot from 'react-plotly.js';
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";

export default function UserInfo( params) {

    const [stockChartXValues, setStockChartXValues] = useState([]);
    const [stockChartYValues, setStockChartYValues] = useState([]);

    useEffect(() => {
        setStockChartXValues(params.stockChartXValues)
        setStockChartYValues(params.stockChartYValues)
    })

    const useStyles = makeStyles((theme) => ({
        container: {
          width: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 25,
          padding: 40,
          [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
          },
        },
      }));

    const classes = useStyles();
    const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          type: "dark",
        },
      });

  return (
    <>
      {/* <Plot
        data={[
          {
            x: stockChartXValues,
            y: stockChartYValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }
        ]}
        layout={{width: 720, height: 440, title: 'A Fancy Plot'}}
      /> */}
      <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!setStockChartXValues ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: stockChartXValues,
                datasets: [
                  {
                    label: '',
                    data: stockChartYValues,
                    backgroundColor: '#3B90F3',
                    barPercentage: 0.5,
                    borderColor: '#3B90F350',

                    categoryPercentage: 0.5,
                    tension: 0.5,
                  },
                ],
            }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
    </>
  );
}
