import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BusinessModelDataT = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  order: number;
  tnc?: string | null;
  tables?: Array<{
    id: number;
    name: string;
    order: number;
  }>;
};

type SortStatus = {
  columnAccessor: string;
  direction: "asc" | "desc";
};

interface BusinessModelState {
  data: BusinessModelDataT[];
  loading: boolean;
  page: number;
  limit: number;
  totalRecords: number;
  search: string;
  sortStatus: SortStatus;
  modalCRUD: boolean;
}

const initialState: BusinessModelState = {
  data: [],
  loading: false,
  page: 1,
  limit: 10,
  totalRecords: 0,
  search: "",
  sortStatus: {
    columnAccessor: "order",
    direction: "asc",
  },
  modalCRUD: false,
};

const businessModelSlice = createSlice({
  name: "businessModel",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<BusinessModelDataT[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortStatus: (state, action: PayloadAction<SortStatus>) => {
      state.sortStatus = action.payload;
    },
    setModalCRUD: (state, action: PayloadAction<boolean>) => {
      state.modalCRUD = action.payload;
    },
  },
});

export const {
  setData,
  setLoading,
  setPage,
  setLimit,
  setTotalRecords,
  setSearch,
  setSortStatus,
  setModalCRUD,
} = businessModelSlice.actions;

export default businessModelSlice.reducer;

