import { useState } from 'react'
import { addDealUrl, deleteDealUrl, loginUrl, updateDealUrl } from 'constants/serverUrlConstants'
import { useNavigate } from 'react-router-dom'
import { getAuthToken } from 'services/LocalStorage/LocalStorageServices'
import { httpOperations } from './http/httpOperations'
import {
  fetchEmailListForSearchQueryUrl,
  getAllSharedDealsOfUserUrl,
  getSingleSharedDealDataUrl,
  shareDealUrl,
} from '../constants/serverUrlConstants'

export const config = () => ({
  headers: {
    'accept-access-token': getAuthToken(),
  },
})
export const AddDealService = () => {
  const [addDealApiState, setAddDealApiState] = useState({
    loading: false,
  })
  const addDeal = async (payload, callbackSuccess, callbackFailed) => {
    setAddDealApiState({
      loading: true,
    })
    try {
      console.log('config', config())
      const response = await httpOperations.http_post(addDealUrl, payload, config())
      setAddDealApiState({
        loading: false,
      })
      console.log(response)
      callbackSuccess(response.data.dealId)
    } catch (err) {
      console.log('error', err)
      console.error(err.response, err.status)
      setAddDealApiState({ loading: false })
      callbackFailed && callbackFailed(err.response.status)
    }
  }
  return { addDeal, addDealApiState }
}

export const UpdateDealService = () => {
  const [updateDealApiState, setUpdateDealApiState] = useState({
    loading: false,
  })
  const updateDeal = async (payload, callbackSuccess, callbackFailed) => {
    setUpdateDealApiState({
      loading: true,
    })
    try {
      console.log('config', config())
      const response = await httpOperations.http_post(updateDealUrl, payload, config())
      setUpdateDealApiState({
        loading: false,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      console.error(err.response, err.status)
      setUpdateDealApiState({ loading: false })
      callbackFailed && callbackFailed(err.response.status)
    }
  }
  return { updateDeal, updateDealApiState }
}

export const DeleteDealService = () => {
  const [deleteDealApiState, setDeleteDealApiState] = useState({
    loading: false,
  })
  const deleteDeal = async (payload, callbackSuccess, callbackFailed) => {
    setDeleteDealApiState({
      loading: true,
    })
    try {
      console.log('config', config())
      const response = await httpOperations.http_post(deleteDealUrl, payload, config())
      setDeleteDealApiState({
        loading: false,
      })
      callbackSuccess(payload.deal_id)
    } catch (err) {
      console.log('error', err)
      console.error(err.response, err.status)
      setDeleteDealApiState({ loading: false })
      callbackFailed && callbackFailed()
    }
  }
  return { deleteDeal, deleteDealApiState }
}

export const FetchEmailListForSearchQuery = () => {
  const [apiState, setApiState] = useState({
    loading: false,
  })
  const fetchEmailList = async (emailSearchString, callbackSuccess, callbackFailed) => {
    setApiState({ loading: true })
    try {
      const response = await httpOperations.http_get(fetchEmailListForSearchQueryUrl, {
        params: {
          emailSearchString: emailSearchString,
        },
      })
      setApiState({ loading: false })
      callbackSuccess(response.data)
    } catch (err) {
      console.error(err)
      setApiState({ loading: false })
      callbackFailed && callbackFailed()
    }
  }

  return { fetchEmailList, searchEmailApiState: apiState }
}

export const ShareDealService = () => {
  const [apiState, setApiState] = useState({
    loading: false,
  })
  const shareDeal = async (payload, callbackSuccess, callbackFailed) => {
    setApiState({ loading: true })
    try {
      const response = await httpOperations.http_post(shareDealUrl, payload, config())
      setApiState({ loading: false })
      callbackSuccess(response.data)
    } catch (err) {
      console.error(err)
      setApiState({ loading: false })
      callbackFailed && callbackFailed()
    }
  }
  return { shareDeal, shareDealApiState: apiState }
}

export const GetSingleSharedDealService = () => {
  const [apiState, setApiState] = useState({
    loading: false,
  })
  const getSingleSharedDealData = async (params, callbackSuccess, callbackFailed) => {
    console.log('singleShared123', params)
    setApiState({ loading: true })
    try {
      const response = await httpOperations.http_get(getSingleSharedDealDataUrl, {
        params: params,
        ...config(),
      })
      setApiState({ loading: false })
      callbackSuccess(response.data.dealData)
    } catch (err) {
      console.error(err.response)
      setApiState({ loading: false })
      callbackFailed && callbackFailed(err.response.message)
    }
  }
  return { getSingleSharedDealData, getSingleSharedDealApiState: apiState }
}

export const GetAllSharedUserDealsService = () => {
  const [apiState, setApiState] = useState({
    loading: false,
  })
  const getAllSharedDealsOfUser = async (params, callbackSuccess, callbackFailed) => {
    setApiState({ loading: true })
    try {
      const response = await httpOperations.http_get(getAllSharedDealsOfUserUrl, {
        ...config(),
      })
      setApiState({ loading: false })
      callbackSuccess(response.data.deals)
    } catch (err) {
      console.error(err.response)
      setApiState({ loading: false })
      callbackFailed && callbackFailed(err.response.message)
    }
  }
  return { getAllSharedDealsOfUser, getAllSharedDealsOfUserApiState: apiState }
}
