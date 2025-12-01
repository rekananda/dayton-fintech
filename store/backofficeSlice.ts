import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BackofficeState = {
  defaultTitlePage: string;
  titlePage: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
};

const initialState: BackofficeState = {
  defaultTitlePage: "Dayton Backoffice",
  titlePage: "Dayton Backoffice",
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const backofficeSlice = createSlice({
  name: 'backoffice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.isError = true;
      state.errorMessage = action.payload;
    },
    setTitlePage: (state, action: PayloadAction<string>) => {
      state.titlePage = action.payload;
    },
  },
});

export const { setLoading, setTitlePage, setError } = backofficeSlice.actions;
export default backofficeSlice.reducer;

