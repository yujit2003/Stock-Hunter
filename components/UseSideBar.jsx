import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { AiFillDelete } from "react-icons/ai";
import { signOut, useSession, auth } from "next-auth/react";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#EEBC1D",
    marginTop: 20,
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#EEBC1D",
    objectFit: "contain",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEBC1D",
    boxShadow: "0 0 3px black",
  },
});

export default function UseSideBar() {
  const classes = useStyles();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  const [watchList, setWatchList] = useState([]);
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    if (session) {
      setEmail(session?.user?.email);
    }

  }, [session]);


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
        console.log(data.user, "yujit user details")
        setWatchList(data.user.watchList);
      } else {
        console.error("Failed to fetch user details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const removeFromWatchlist = async (coin) => {
    try {
      const updatedWatchList = watchList.filter(item => item !== coin);
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
        fetchUser();
      } else {
        console.log("Failed to update watchlist.");
      }
    } catch (error) {
      console.log("Error during watchList adding: ", error);
    }
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
          // src={user.photoURL}
          // alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.name}
                </span>
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {watchList.length > 0 ? (
                    watchList.map((coin, index) => (
                      <div className={classes.coin} key={index}>
                        <span>{coin}</span>
                        <span style={{ display: "flex", gap: 8 }}>
                          Remove
                          <AiFillDelete
                            style={{ cursor: "pointer" }}
                            fontSize="16"
                            onClick={() => removeFromWatchlist(coin)}
                          />
                        </span>
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>

              </div>
              <Button
                variant="contained"
                className={classes.logout}
              // onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
