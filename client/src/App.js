import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { Switch, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./redux/userSlice";
import { setExpenses, setDebt } from "./redux/expenseSlice";

import LoginPage from "./Login/LoginPage";
import SignUpPage from "./Login/SignUpPage";
import InvitationPage from "./Login/InvitationPage";
import ExpensePage from "./Expense/ExpensePage";
import SettlePage from "./Settle/SettlePage";
import ChartPage from "./Chart/ChartPage";
import ProfilePage from "./Profile/ProfilePage";
import BaseToast from "./components/BaseToast";

import { INSTANCE } from "./constants";
import { getCookie } from "./cookieHelper";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pairId, matched, login } = useSelector(selectUser);
  const [readyRender, setReadyRender] = useImmer({
    user: false,
    expenses: false,
    debt: false,
  });

  const getUserJSON = (str) => {
    let obj;
    try {
      obj = JSON.parse(str);
    } catch {
      obj = {};
    } finally {
      if (obj === null) obj = {};
    }
    return obj;
  };

  useEffect(() => {
    setReadyRender((ready) => {
      ready.user = false;
      ready.expenses = false;
      ready.debt = false;
    });

    const { pairId: pairId2, username } = getUserJSON(getCookie());
    INSTANCE.get("/api/account/getProfile", {
      params: { pairId: pairId2 },
    })
      .then((res) => {
        const { user0, user1, budget, defaultExpenseAllocation } = res.data;
        if (username !== user0.username && username !== user1.username) {
          dispatch(setUser({ login: false }));
        } else {
          dispatch(
            setUser({
              pairId: String(pairId2),
              name0: user0.username === username ? user0.name : user1.name,
              name1: user0.username === username ? user1.name : user0.name,
              username,
              matched: true,
              budget,
              defaultExpenseAllocation,
              login: true,
            })
          );
        }
      })
      .catch(() => {
        if (typeof username === "string") {
          dispatch(setUser({ matched: false, login: true }));
        } else {
          dispatch(setUser({ login: false }));
        }
      })
      .finally(() =>
        setReadyRender((ready) => {
          ready.user = true;
        })
      );
  }, [getCookie()]);

  useEffect(() => {
    if (readyRender.user && login && matched) {
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
        .finally(() =>
          setReadyRender((ready) => {
            ready.expenses = true;
          })
        );

      INSTANCE.get("/api/debt", { params: { pairId } })
        .then((res) => {
          if (res.status === 200)
            dispatch(
              setDebt({
                debt: res.data,
              })
            );
        })
        .finally(() =>
          setReadyRender((ready) => {
            ready.debt = true;
          })
        );
    }
  }, [readyRender.user]);

  const toRoot = () => history.push("/");

  if (!readyRender.user) return <></>;

  if (!login || !matched) {
    return (
      <>
        <Switch>
          <Route
            exact
            path="/"
            component={login ? InvitationPage : LoginPage}
          />
          <Route exact path="/signup" component={SignUpPage} />
          <Route render={toRoot} />
        </Switch>
        <BaseToast />
      </>
    );
  }

  return readyRender.expenses && readyRender.debt ? (
    <>
      <Switch>
        <Route exact path="/" component={ExpensePage} />
        <Route exact path="/settles" component={SettlePage} />
        <Route exact path="/charts" component={ChartPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route render={toRoot} />
      </Switch>
      <BaseToast />
    </>
  ) : (
    <></>
  );
}

export default App;
