import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tableReducer from "./slices/tableSlice"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"

const persistConfig = {
  key: "root",
  storage
}

const rootReducer = combineReducers({
  table: tableReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false 
    })
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
