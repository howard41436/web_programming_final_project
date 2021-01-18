import { createSlice } from "@reduxjs/toolkit";
import { PUBLIC_URL } from "../constants";

export const infoSlice = createSlice({
  name: "info",
  initialState: {
    categoryInfo: {
      food: {
        index: 1,
        color: "#fbc658",
        icon: "nc-icon nc-shop text-warning",
      },
      transportation: {
        index: 2,
        color: "#6bd098",
        icon: "nc-icon nc-bus-front-12 text-success",
      },
      education: {
        index: 3,
        color: "#51bcda",
        icon: "nc-icon nc-hat-3 text-primary",
      },
      others: {
        index: 4,
        color: "#a3a3a3",
        icon: "nc-icon nc-cart-simple text-danger",
      },
    },
    ownerIcon: {
      "-1": {
        src: PUBLIC_URL("/img/boy_girl.png"),
        alt: "both",
      },
      0: {
        src: PUBLIC_URL("/img/boy.png"),
        alt: "boy",
      },
      1: {
        src: PUBLIC_URL("/img/girl.png"),
        alt: "girl",
      },
      2: {
        src: PUBLIC_URL("/img/boy2.png"),
        alt: "boy2",
      },
      3: {
        src: PUBLIC_URL("/img/girl2.png"),
        alt: "girl2",
      },
    },
  },
  reducers: {
    setIcon: (state, action) => {
      state.ownerIcon["-1"].src = action.payload["-1"];
      state.ownerIcon["0"].src = action.payload["0"];
      state.ownerIcon["1"].src = action.payload["1"];
    },
  },
});
export const { setIcon } = infoSlice.actions;
export default infoSlice.reducer;
export const selectInfo = (state) => state.info;
