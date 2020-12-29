import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./redux/userSlice";
import { setExpenses } from "./redux/expenseSlice";

import ExpensePage from "./Expense/ExpensePage";
import SettlePage from "./Settle/SettlePage";
import ChartPage from "./Chart/ChartPage";

import { INSTANCE } from "./constants";

function App() {
  const dispatch = useDispatch();
  const { pairId, ready: readyUser } = useSelector(selectUser);
  const [readyExpenses, setReadyExpenses] = useState(false);

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

  useEffect(() => {
    if (readyUser) {
      INSTANCE.get("/api/allRecords", { params: { pairId } })
        .then((res) => {
          if (res.status === 200)
            dispatch(
              setExpenses({
                expenses: res.data.reduce(
                  // eslint-disable-next-line dot-notation
                  (obj, cur) => ({ ...obj, [cur["_id"]]: cur }),
                  {}
                ),
              })
            );
        })
        .finally(() => setReadyExpenses(true));
    }
  }, [readyUser]);

  return readyUser && readyExpenses ? (
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
