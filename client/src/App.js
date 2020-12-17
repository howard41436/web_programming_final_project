import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import TablePage from "./Table/TablePage";
import ChartPage from "./Chart/ChartPage";
import NewItemPage from "./NewItem/NewItemPage";

function App() {
  const [pairId] = useState(0);

  return (
    <Switch>
      <Route exact path="/" component={() => <TablePage pairId={pairId} />} />
      <Route exact path="/charts" component={ChartPage} />
      <Route exact path="/newitems" component={NewItemPage} />
    </Switch>
  );
}

export default App;
