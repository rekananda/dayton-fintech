import { EventDataT } from '@/config/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataTableSortStatus } from 'mantine-datatable';

type DataEventState = {
  modalCRUD: boolean;
  limit: number;
  page: number;
  loading: boolean;
  data: EventDataT[];
  totalRecords: number;
  search: string;
  sortStatus: DataTableSortStatus<EventDataT>;
};

const initialState: DataEventState = {
  modalCRUD: false,
  limit: 10,
  page: 1,
  loading: false,
  data: [],
  totalRecords: 0,
  search: "",
  sortStatus: {
    columnAccessor: "date",
    direction: "desc",
  },
};

const eventSlice = createSlice({
  name: 'event',
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
    setData: (state, action: PayloadAction<EventDataT[]>) => {
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
    setSortStatus: (state, action: PayloadAction<DataTableSortStatus<EventDataT>>) => {
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
} = eventSlice.actions;
export default eventSlice.reducer;

