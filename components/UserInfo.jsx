"use client"
import React, { useState, useEffect } from "react";
import ChartInfo from "@/components/ChartInfo";
import {
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserInfo(params) {
  const [symboldata, setSymboldata] = useState({});
  const id = params.symbol[0];
  const { data: session } = useSession();
  const [watchList, setWatchList] = useState([]);
  const [user, setUser] = useState({});
  const router = useRouter();

  const [stockChartXValues, setStockChartXValues] = useState([]);
  const [stockChartYValues, setStockChartYValues] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [email, setEmail] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  // const watchList = ["yujit", "jatin", "pramila"]

  useEffect(() => {
    setSymbol(id);
  })


  useEffect(() => {
    if (session) {
      // Assume `session.user.watchList` is available
      // setWatchList(symbol);
      // setInWatchlist(session?.user?.watchList);
      setEmail(session?.user?.email);
    }
    fetchStock();

  }, [symbol, session]);

  useEffect(() => {
    if (user && user.watchList) {
      setWatchList([...user.watchList, symbol]);
      setInWatchlist(user.watchList.includes(symbol));
    }
  }, [user, symbol]);

  useEffect(() => {
    if (email) {
      fetchUser();
    }
  }, [email]);

  const fetchUser = async () => {
    try {
      // console.log(email, "yujit email")
      const res = await fetch(`/api/fetchdata?email=${email}`);
      const data = await res.json();

      if (res.ok) {
        if (data == {}) {
          fetchUser();
        }
        setUser(data.user);
        // console.log(data.user, "yujit user details")
      } else {
        console.error("Failed to fetch user details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchStock = () => {
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`;
    // let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=PX4QOS0MNJGWLFWX`;

    fetch(API_Call)
      .then(response => response.json())
      .then(data => {
        const chartXValues = [];
        const chartYValues = [];

        for (let key in data['Time Series (5min)']) {
          chartXValues.push(key);
          chartYValues.push(data['Time Series (5min)'][key]['1. open']);
        }

        setStockChartXValues(chartXValues);
        setStockChartYValues(chartYValues);
        setSymboldata(data['Meta Data']);
      });
  };

  const addToWatchlist = async () => {
    try {
      // console.log(watchList, "yujit")
      const res = await fetch("/api/watchList", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          watchList: watchList,
        }),
      });

      if (res.ok) {
        setInWatchlist(true);
        fetchUser();
      } else {
        console.log("Failed to update watchlist.");
      }
    } catch (error) {
      console.log("Error during watchList adding: ", error);
    }
  };

  const removeFromWatchlist = async () => {
    try {
      const updatedWatchList = watchList.filter(item => item !== symbol);
      setWatchList(updatedWatchList);

      const res = await fetch("/api/watchList", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          watchList: updatedWatchList,
        }),
      });

      if (res.ok) {
        setInWatchlist(true);
        fetchUser();
        setInWatchlist(false);
      } else {
        console.log("Failed to update watchlist.");
      }
    } catch (error) {
      console.log("Error during watchList adding: ", error);
    }

  };

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  return (
    <>

      <div className={classes.container}>
        {symboldata &&
          <div className={classes.sidebar}>
            <span style={{ color: "rgb(91 33 182)" }}>

              <Typography variant="h3" className={classes.heading}>
                {symboldata['2. Symbol']}
              </Typography>
            </span>
            <Typography variant="subtitle1" className={classes.description}>
            <span style={{ color: "rgb(167 139 250)" }}>
              <Typography variant="h5" className={classes.heading}>
                Information About Symbol:
              </Typography>
              </span>
              {symboldata['1. Information']}
            </Typography>
            <div className={classes.marketData}>
              <span style={{ display: "flex" }}>
              <span style={{ color: "rgb(167 139 250)" }}>
                <Typography variant="h5" className={classes.heading}>
                  Output Size:
                </Typography>
                </span>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {symboldata['5. Output Size']}.
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
              <span style={{ color: "rgb(167 139 250)" }}>
                <Typography variant="h5" className={classes.heading}>
                  Last Refreshed:
                </Typography>
                </span>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                    color: "green"
                  }}
                >
                  {symboldata['3. Last Refreshed']}.
                </Typography>
              </span>
              <span style={{ display: "flex", color: "rgb(167 139 250)" }}>
                <span style={{ color: "rgb(167 139 250)" }}>
                <Typography variant="h5" className={classes.heading}>
                  Interval:
                </Typography>
                </span>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                    color: "white"
                  }}
                  >
                  {symboldata['4. Interval']}
                </Typography>
                  </span>
              <span style={{ display: "flex" , color: "rgb(167 139 250)"}}>
                <Typography variant="h5" className={classes.heading}>
                  Time Zone:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                    color:"white"
                  }}
                >
                  {symboldata['6. Time Zone']}
                </Typography>
              </span>
              <Button
                variant="outlined"
                style={{
                  width: "100%",
                  height: 40,
                  backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
                }}
                onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
              >
                {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
              <br />
              <br />
              <Button
                variant="outlined"
                style={{
                  width: "100%",
                  height: 40,
                  backgroundColor: "#EEBC1D",
                }}
                onClick={() => router.replace("/dashboard")}
              >
                Back To Dashboard
              </Button>
            </div>
          </div>
        }
        <ChartInfo symbol={params} stockChartYValues={stockChartYValues} stockChartXValues={stockChartXValues} />
      </div>
    </>
  );
}
