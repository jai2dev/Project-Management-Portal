import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import { UserContext } from "../store/UserContext";
import Home from "./homepage/Home";
import About from "./aboutpage/About";
import Projects from "./projectspage/Projects";
import Nav from "./navigation/Nav";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/react-hooks";
import { refreshMutation } from "../queries";
import Login from "./login/Login";

function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({
    id: "",
    role: "",
    auth: "",
    refresh: "",
  });
  const [cookies, setCookie, removeCookie] = useCookies(["refresh", "access"]);

  // Uncomment all lines from here to the end of useEffect if this doesn't work 😅

  // The mutation to be called every hour to keep the user logged in
  const [refresh] = useMutation(refreshMutation, {
    onCompleted({ renewAuth }) {
      const now = new Date().getTime();

      // Update the global user on data return
      setUser(renewAuth);

      // Set the refresh cookie for 7 hours from current time
      setCookie("refresh", user.refresh, {
        path: "/",
        expires: new Date(now + 7 * 3600 * 1000),
      });

      // Set the access cookie for 1 hour from current time
      setCookie("access", user.auth, {
        path: "/",
        expires: new Date(now + 1 * 3600 * 1000),
      });
    },
  });

  useEffect(() => {
    // First time when thge page loads, call the mutation
    refresh({ variables: { refresh: cookies.refresh } });

    // Call the mutation every 1 hour because every one hour, the access token becomes invalid
    const interval = setInterval(() => {
      refresh({ variables: { refresh: cookies.refresh } });
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`App ${theme}`} style={{ minHeight: "100vh" }}>
      <Router>
        <UserContext.Provider value={[user, setUser]}>
          <ThemeContext.Provider value={[theme, setTheme]}>
            <Nav />

            <Route path="/" exact component={Home} />
            <Route path="/about/" exact component={About} />
            <Route path="/login/" exact component={Login} />
            <Route path="/projects/" exact component={Projects} />
            {/* <Route path="/profile/" exact component={Profile} />
            <Route path="/projects/:id" exact component={Project} />
            <Route path="/organizations/" exact component={Organizations} />
            <Route path="/organizations/:id" exact component={Organization} /> */}
          </ThemeContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
