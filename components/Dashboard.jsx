"use client"
import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
    Container,
    createTheme,
    TableCell,
    LinearProgress,
    ThemeProvider,
    Typography,
    TextField,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    Table,
    Paper,
} from "@material-ui/core";
import { useRouter } from "next/navigation";

const Dashboard = () => {

    const [search, setSearch] = useState("ibm");
    const [symbol, setSymbol] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const useStyles = makeStyles({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#131111",
            },
            fontFamily: "Montserrat",
        },
        pagination: {
            "& .MuiPaginationItem-root": {
                color: "gold",
            },
        },
    });

    const classes = useStyles();
    // const history = useHistory();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    useEffect(() => {
        fetchStock();
    }, []);
    useEffect(() => {
        setLoading(true);
        fetchStock();
    }, [search]);

    const fetchStock = async () => {
        // let API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=70O5LSBEM4RP07TA`;
        let API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`;


        fetch(API_Call)
            .then(response => response.json())
            .then(data => {
                setSymbol(data.bestMatches)
                setLoading(false);
            });
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    style={{ margin: 18, fontFamily: "Montserrat" }}
                >
                    Create and Manage your Stock Symbols
                </Typography>
                <TextField
                    label="Search For a Crypto Currency.."
                    variant="outlined"
                    style={{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <TableContainer component={Paper}>

                    <Table aria-label="simple table">
                        <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                            <TableRow>
                                {["Company Name", "Region", "Currency", "Match Score", "Type"].map((head) => (
                                    <TableCell

                                        style={{
                                            color: "black",
                                            fontWeight: "700",
                                            fontFamily: "Montserrat",
                                        }}
                                        key={head}
                                        align="center"
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {loading ? (
                            <LinearProgress style={{ backgroundColor: "gold", width:"100%"}} />
                        ) : (
                            <TableBody>
                                {symbol.map((row) => {
                                    return (
                                        <TableRow
                                            onClick={() =>router.replace(`dashboard/${row['1. symbol']}`)}
                                            className={classes.row}
                                            key={row['1. symbol']}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    display: "flex",
                                                    gap: 15,
                                                }}
                                            >
                                                <div
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    <span
                                                        style={{
                                                            textTransform: "uppercase",
                                                            fontSize: 22,
                                                        }}
                                                    >
                                                        {row['1. symbol']}
                                                    </span>
                                                    <span style={{ color: "darkgrey" }}>
                                                        {row['2. name']}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                {row['4. region']}{" "}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {row['8. currency']}
                                            </TableCell>
                                            <TableCell align="right" style={{
                                                color: "rgb(14, 203, 129)",
                                                fontWeight: 500,
                                            }}>
                                                {row['9. matchScore']}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row['3. type']}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}

                    </Table>
                </TableContainer>

                {/* Comes from @material-ui/lab */}
                {/* <Pagination
          count="10"
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        /> */}
            </Container>
        </ThemeProvider>
    )
}
export default Dashboard;
