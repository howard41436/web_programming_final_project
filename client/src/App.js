import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./redux/userSlice";

import ExpensePage from "./Expense/ExpensePage";
import SettlePage from "./Settle/SettlePage";
import ChartPage from "./Chart/ChartPage";

function App() {
  const dispatch = useDispatch();
  const { ready } = useSelector(selectUser);

  useEffect(() => {
    dispatch(
      setUser({
        pairId: 0,
        boyName: "Tom",
        girlName: "Amy",
        ready: true,
      })
    );
  }, []);

  return ready ? (
    <Switch>
      <Route exact path="/" component={ExpensePage} />
      <Route exact path="/settles" component={SettlePage} />
      <Route exact path="/charts" component={ChartPage} />
    </Switch>
  ) : (
    <></>
  );
}

export default App;
