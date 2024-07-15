import { LocalStorageKeys } from '../../constants/LocalStorageKeys'
import * as LocalStorage from './LocalStorage'
export const setAuthToken = (authToken) => {
  LocalStorage.setItem(LocalStorageKeys.headerVerificationToken, authToken)
}

export const getAuthToken = () => {
  return LocalStorage.getItem(LocalStorageKeys.headerVerificationToken)
}
