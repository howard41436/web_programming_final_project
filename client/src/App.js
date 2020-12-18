import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./redux/userSlice";

import TablePage from "./Table/TablePage";
import ChartPage from "./Chart/ChartPage";
import NewItemPage from "./NewItem/NewItemPage";

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
      <Route exact path="/" component={TablePage} />
      <Route exact path="/charts" component={ChartPage} />
      <Route exact path="/newitems" component={NewItemPage} />
    </Switch>
  ) : (
    <></>
  );
}

export default App;
