import { ConfigDataT } from '@/config/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataTableSortStatus } from 'mantine-datatable';

type DataConfigState = {
  modalCRUD: boolean;
  limit: number;
  page: number;
  loading: boolean;
  data: ConfigDataT[];
  totalRecords: number;
  search: string;
  sortStatus: DataTableSortStatus<ConfigDataT>;
};

const initialState: DataConfigState = {
  modalCRUD: false,
  limit: 10,
  page: 1,
  loading: false,
  data: [],
  totalRecords: 0,
  search: "",
  sortStatus: {
    columnAccessor: "key",
    direction: "asc",
  },
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setModalCRUD: (state, action: PayloadAction<boolean>) => {
      state.modalCRUD = action.payload;
    },
    toggleModalCRUD: (state) => {
      state.modalCRUD = !state.modalCRUD;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
    setData: (state, action: PayloadAction<ConfigDataT[]>) => {
      state.data = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortStatus: (state, action: PayloadAction<DataTableSortStatus<ConfigDataT>>) => {
      state.sortStatus = action.payload;
    },
  },
});

export const { 
  setModalCRUD,
  toggleModalCRUD, 
  setLoading, 
  toggleLoading, 
  setData, 
  setTotalRecords,
  setLimit, 
  setPage, 
  setSearch, 
  setSortStatus,
} = configSlice.actions;
export default configSlice.reducer;

