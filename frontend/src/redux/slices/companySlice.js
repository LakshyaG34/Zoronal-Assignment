import {
    createSlice,
} from "@reduxjs/toolkit";

const initialState = {
    companies: [],
    loading: false,
    search: "",
    city: "",
    sort: "",
};

const companySlice =
    createSlice({
        name: "company",
        initialState,
        reducers: {

            setCompanies: (
                state,
                action
            ) => {
                state.companies =
                    action.payload;
            },

            setLoading: (
                state,
                action
            ) => {
                state.loading =
                    action.payload;
            },

            setSearch: (
                state,
                action
            ) => {
                state.search =
                    action.payload;
            },

            setCity: (
                state,
                action
            ) => {
                state.city =
                    action.payload;
            },

            setSort: (
                state,
                action
            ) => {
                state.sort =
                    action.payload;
            },
        },
    });

export const {
    setCompanies,
    setLoading,
    setSearch,
    setCity,
    setSort,
} = companySlice.actions;

export default
    companySlice.reducer;