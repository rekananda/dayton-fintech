import { configureStore } from '@reduxjs/toolkit';
import landingReducer from './landingSlice';
import backofficeReducer from './backofficeSlice';
import menuReducer from './dataMenuSlice';
import timelineReducer from './dataTimelineSlice';
import legalReducer from './dataLegalSlice';
import qnaReducer from './dataQnASlice';
import configReducer from './dataConfigSlice';
import eventReducer from './dataEventSlice';
import businessModelReducer from './dataBusinessModelSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      landing: landingReducer,
      backoffice: backofficeReducer,
      menu: menuReducer,
      timeline: timelineReducer,
      legal: legalReducer,
      qna: qnaReducer,
      config: configReducer,
      event: eventReducer,
      businessModel: businessModelReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

