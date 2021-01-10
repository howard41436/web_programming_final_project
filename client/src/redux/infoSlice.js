import { createSlice } from "@reduxjs/toolkit";
import { BASENAME } from "../constants";

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
        src: `${BASENAME}img/both1.png`,
        alt: "both",
      },
      0: {
        src: `${BASENAME}img/boy.png`,
        alt: "boy",
      },
      1: {
        src: `${BASENAME}img/girl.png`,
        alt: "girl",
      },
    },
  },
  reducers: {},
});
export default infoSlice.reducer;
export const selectInfo = (state) => state.info;
