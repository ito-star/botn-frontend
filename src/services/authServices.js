import { useState } from 'react'
import { httpOperations } from './http/httpOperations'
import {
  forgotPasswordUrl,
  getUserDetailsUrl,
  googleLoginUrl,
  loginUrl,
  signupUrl,
  verifyForgotPasswordUrl,
  verifySignupUrl,
} from '../constants/serverUrlConstants'
import { config } from './dealServices'
export const LoginService = () => {
  const [loginApiState, setLoginApiState] = useState({
    loading: false,
  })
  const login = async (payload, callbackSuccess, callbackFailed) => {
    setLoginApiState({
      loading: true,
    })
    try {
      const response = await httpOperations.http_post(loginUrl, payload)
      console.log(response)
      setLoginApiState({
        loading: false,
        loginResponse: response,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      console.error(err.response, err.status)
      const newLoginApiState = {
        loading: false,
        error: true,
      }
      if (err.response.status === 401) {
        newLoginApiState.error = "Email and password doesn't match"
      } else {
        newLoginApiState.error = 'Something went wrong'
      }
      setLoginApiState(newLoginApiState)
      callbackFailed && callbackFailed()
    }
  }
  return { loginApiState, login }
}

export const SignupService = () => {
  const [signupApiState, setSignupApiState] = useState({
    loading: false,
  })
  const signup = async (payload, callbackSuccess, callbackFailed) => {
    setSignupApiState({
      loading: true,
    })
    try {
      const response = await httpOperations.http_post(signupUrl, payload)
      console.log(response)
      setSignupApiState({
        loading: false,
        signupResponse: response,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('###### error', err)
      console.error(err.response, err.status)
      const newSignupApiState = {
        loading: false,
        error: true,
      }
      if (err.response.status === 409) {
        newSignupApiState.error = 'Email already exists'
      } else {
        newSignupApiState.error = 'Something went wrong'
      }
      setSignupApiState(newSignupApiState)
      console.log(newSignupApiState)
      callbackFailed && callbackFailed(newSignupApiState.error)
    }
  }
  return { signupApiState, signup }
}

export const VerifySignupService = () => {
  const [verifySignupApiState, setVerifySignupApiState] = useState({
    loading: false,
  })
  const verifySignup = async (payload, callbackSuccess, callbackFailed) => {
    setVerifySignupApiState({
      loading: true,
    })
    try {
      const response = await httpOperations.http_post(verifySignupUrl, payload)
      console.log(response)
      setVerifySignupApiState({
        loading: false,
        signupResponse: response,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      console.error(err.response, err.status)
      let errorString
      if (err.response.status === 401) {
        errorString = 'Verification failed'
      } else {
        errorString = 'Something went wrong'
      }
      callbackFailed && callbackFailed(errorString)
    }
  }
  return { verifySignupApiState, verifySignup }
}

export const ForgotPasswordService = () => {
  const [forgotPasswordApiState, setForgotPasswordApiState] = useState({
    loading: false,
  })
  const forgotPassword = async (payload, callbackSuccess, callbackFailed) => {
    setForgotPasswordApiState({
      loading: true,
    })
    try {
      const response = await httpOperations.http_post(forgotPasswordUrl, payload)
      console.log(response)
      setForgotPasswordApiState({
        loading: false,
        signupResponse: response,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      callbackFailed && callbackFailed('Something went wrong')
    }
  }
  return { forgotPasswordApiState, forgotPassword }
}

export const ResetPasswordService = () => {
  const [resetPasswordApiState, setResetPasswordApiState] = useState({
    loading: false,
  })
  const resetPassword = async (payload, callbackSuccess, callbackFailed) => {
    setResetPasswordApiState({
      loading: true,
    })
    try {
      const response = await httpOperations.http_post(verifyForgotPasswordUrl, payload)
      console.log(response)
      setResetPasswordApiState({
        loading: false,
        signupResponse: response,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      callbackFailed && callbackFailed('Something went wrong')
    }
  }
  return { resetPasswordApiState, resetPassword }
}

export const GetUserData = () => {
  const [userDataApiState, setUserDataApiState] = useState({
    loading: false,
  })
  const getUserData = async (callbackSuccess, callbackFailed) => {
    setUserDataApiState({
      loading: true,
    })
    try {
      const header = config()
      console.log('header', header)
      const response = await httpOperations.http_get(getUserDetailsUrl, config())
      setUserDataApiState({
        loading: false,
      })
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      callbackFailed && callbackFailed('Something went wrong')
    }
  }
  return { userDataApiState, getUserData }
}

export const GoogleLoginCustom = () => {
  const googleLogin = async (payload, callbackSuccess, callbackFailed) => {
    try {
      const response = await httpOperations.http_post(googleLoginUrl, payload)
      callbackSuccess(response.data)
    } catch (err) {
      console.log('error', err)
      callbackFailed && callbackFailed('Something went wrong')
    }
  }
  return { googleLogin }
}
