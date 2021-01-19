import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { Switch, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./redux/userSlice";
import { setIcon } from "./redux/infoSlice";
import { setExpenses, setDebt } from "./redux/expenseSlice";

import LoginPage from "./Login/LoginPage";
import SignUpPage from "./Login/SignUpPage";
import InvitationPage from "./Login/InvitationPage";
import ExpensePage from "./Expense/ExpensePage";
import SettlePage from "./Settle/SettlePage";
import ChartPage from "./Chart/ChartPage";
import ProfilePage from "./Profile/ProfilePage";
import BaseToast, { errorToast } from "./components/BaseToast";

import { INSTANCE, AVATAR } from "./constants";
import { getCookie } from "./cookieHelper";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    pairId,
    user0: { icon },
    user1: { icon: icon1 },
    matched,
    login,
  } = useSelector(selectUser);
  const [readyRender, setReadyRender] = useImmer({
    user: false,
    expenses: false,
    debt: false,
  });

  useEffect(() => {
    setReadyRender((ready) => {
      ready.user = false;
      ready.expenses = false;
      ready.debt = false;
    });

    const username = getCookie();
    INSTANCE.get("/api/account/getUser", {
      params: { username },
    })
      .then(async (res) => {
        const { matched: _matched, pairId: _pairId, inviteCode } = res.data;
        if (!_matched) {
          dispatch(
            setUser({
              username,
              matched: false,
              inviteCode,
              login: true,
            })
          );
        } else {
          await INSTANCE.get("/api/account/getProfile", {
            params: { pairId: _pairId },
          })
            .then((_res) => {
              const {
                user0,
                user1,
                budget,
                defaultExpenseAllocation,
                anniversary,
              } = _res.data;
              const today = new Date().toISOString().slice(0, 10);
              dispatch(
                setUser({
                  pairId: String(_pairId),
                  user0,
                  user1,
                  username,
                  user: user0.username === username ? "0" : "1",
                  matched: true,
                  budget: budget || {
                    user0: { total: 0 },
                    user1: { total: 0 },
                  },
                  defaultExpenseAllocation: {
                    ...defaultExpenseAllocation,
                    details: defaultExpenseAllocation.details || {
                      percentage: {
                        user0: 50,
                        user1: 50,
                      },
                    },
                  },
                  anniversary: anniversary || today,
                  login: true,
                })
              );
            })
            .catch((err) => errorToast(err, "Loading"));
        }
      })
      .catch(() => dispatch(setUser({ login: false })))
      .finally(() => {
        setReadyRender((ready) => {
          ready.user = true;
        });
      });
  }, [getCookie()]);

  useEffect(() => {
    dispatch(
      setIcon({
        "-1": AVATAR[`${icon}${icon1}`],
        0: AVATAR[icon],
        1: AVATAR[icon1],
      })
    );
  }, [icon, icon1]);

  useEffect(() => {
    if (readyRender.user && login && matched) {
      INSTANCE.get("/api/monthlyRecords", {
        params: {
          pairId,
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
        },
      })
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
        .catch((err) => errorToast(err, "Loading"))
        .finally(() =>
          setReadyRender((ready) => {
            ready.expenses = true;
          })
        );

      INSTANCE.get("/api/debt", { params: { pairId } })
        .then((res) => {
          if (res.status === 200) {
            const { debtOfUser0, recordsAndSettlements } = res.data;
            dispatch(
              setDebt({
                debt: {
                  debtOfUser0,
                  recordsAndSettlements: recordsAndSettlements.reduce(
                    // eslint-disable-next-line dot-notation
                    (obj, cur) => ({ ...obj, [cur.content["_id"]]: cur }),
                    {}
                  ),
                },
              })
            );
          }
        })
        .catch((err) => errorToast(err, "Loading"))
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
