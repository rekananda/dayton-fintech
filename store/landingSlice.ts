import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuDataT, TimelineDataT, BussinessModelDataT, EventDataT, LegalDataT, QnADataT } from '@/config/types';
import { DataMenus, DataTimeline, DataBussinessModel, DataEvents, DataLegal, DataQnA, mainWhatsappLink, mainWhatsappNumber, mainWhatsappMessage, mainEmail, mainTitle, mainDescription, mainBadges, secondaryBadges } from '@/variables/dummyData';

type LandingPageConfig = {
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappLink: string;
  email: string;
  mainTitle?: string;
  mainDescription?: string;
  mainBadges?: string[];
  secondaryBadges?: string[];
};

type LandingPageState = {
  menus: MenuDataT[];
  timelines: TimelineDataT[];
  businessModels: BussinessModelDataT[];
  events: EventDataT[];
  legals: LegalDataT[];
  qnas: QnADataT[];
  config: LandingPageConfig;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
};

const initialState: LandingPageState = {
  menus: DataMenus,
  timelines: DataTimeline,
  businessModels: DataBussinessModel,
  events: DataEvents,
  legals: DataLegal,
  qnas: DataQnA,
  config: {
    whatsappNumber: mainWhatsappNumber,
    whatsappMessage: decodeURIComponent(mainWhatsappMessage),
    whatsappLink: mainWhatsappLink,
    email: mainEmail,
    mainTitle,
    mainDescription,
    mainBadges,
    secondaryBadges,
  },
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLandingData: (state, action: PayloadAction<Omit<LandingPageState, 'isLoading' | 'isError' | 'errorMessage'>>) => {
      state.menus = action.payload.menus;
      state.timelines = action.payload.timelines;
      state.businessModels = action.payload.businessModels;
      state.events = action.payload.events;
      state.legals = action.payload.legals;
      state.qnas = action.payload.qnas;
      state.config = action.payload.config;
      state.isError = false;
      state.errorMessage = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.isError = true;
      state.errorMessage = action.payload;
    },
    resetToDummy: (state) => {
      state.menus = DataMenus;
      state.timelines = DataTimeline;
      state.businessModels = DataBussinessModel;
      state.events = DataEvents;
      state.legals = DataLegal;
      state.qnas = DataQnA;
      state.config = {
        whatsappNumber: mainWhatsappNumber,
        whatsappMessage: decodeURIComponent(mainWhatsappMessage),
        whatsappLink: mainWhatsappLink,
        email: mainEmail,
        mainTitle: "Trading Emas Otomatis, Aman dan Terukur",
        mainDescription: "Pendekatan trend-following yang disiplin dengan target adaptif mengikuti volatilitas, pengendalian eksposur, serta jeda otomatis saat rilis data berdampak tinggi.",
        mainBadges: ["Gold • XAUUSD • H1 • Tren"],
        secondaryBadges: ["Profit Sharing <b>25%</b>", "Referral hingga <b>10%</b>", "<b>Broker MT4 • H1</b>"],
      };
      state.isError = true;
      state.errorMessage = 'Menggunakan data dummy karena API error';
    },
  },
});

export const { setLoading, setLandingData, setError, resetToDummy } = landingSlice.actions;
export default landingSlice.reducer;

