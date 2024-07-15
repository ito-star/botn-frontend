import './App.css'
import CustomRange from './components/CustomRange'
import { InvestmentInputProvider } from './context/InvestmentInputContext'
import Calculator from './pages/Calculator/Calculator'
import Login from './pages/Login'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { GlobalStyles } from './GlobalStyles'
import React, { useContext, useEffect } from 'react'
// import { Navigate } from './hooks/UseNavigate'
import { login_path } from './constants/clientRouteConstants'
import Listing from './pages/Listing'
import { NotificationProvider } from './context/Notification'
import * as clientRoutes from './constants/clientRouteConstants'
import EmailVerificationSent from './pages/EmailSent/EmailVerificationSent'
import VerifySignup from 'pages/VerifySignup'
import { UserContext, UserContextProvider } from 'context/UserContext'
import { GetUserData } from 'services/authServices'
import { PopupContextProvider } from 'context/PopupContext'
function App() {
  const location = useLocation()
  const { setUserData } = useContext(UserContext)
  const { userDataApiState, getUserData } = GetUserData()
  useEffect(() => {
    const onGetUserDataSuccess = ({ userData }) => {
      console.log('userDataOnLoad', userData)
      userData.isLoggedIn = true
      setUserData(userData)
    }
    const onGetUserDataFail = () => {
      setUserData({ isLoggedIn: false })
    }

    const { pathname } = location
    if (
      pathname != clientRoutes.loginUrl &&
      pathname != clientRoutes.forgotPasswordUrl &&
      !pathname.startsWith(clientRoutes.verifySignupUrl) &&
      !pathname.startsWith(clientRoutes.resetPasswordUrl) &&
      pathname != clientRoutes.signupUrl &&
      pathname != clientRoutes.emailSentUrl
    ) {
      getUserData(onGetUserDataSuccess, onGetUserDataFail)
    }
  }, [])

  return (
    <NotificationProvider>
      <InvestmentInputProvider>
        <PopupContextProvider>
          <div className="app">
            {/* <Calculator /> */}
            {/* <Login /> */}
            {/* <CustomRange /> */}
            <Routes>
              <Route exact path="/" element={<Navigate to="/calculator" />} />
              <Route path={clientRoutes.loginUrl} element={<Login />}></Route>
              <Route path={clientRoutes.forgotPasswordUrl} element={<ForgotPassword />}></Route>
              <Route path={clientRoutes.signupUrl} element={<Signup />}></Route>
              <Route
                path={clientRoutes.verifySignupUrl + '/:emailVerifyString'}
                element={<VerifySignup />}
              ></Route>
              <Route
                path={clientRoutes.resetPasswordUrl + '/:verificationString'}
                element={<ResetPassword />}
              ></Route>
              <Route path={clientRoutes.calculatorUrl} element={<Calculator />}></Route>
              <Route path={clientRoutes.dealListingUrl} element={<Listing />}></Route>
              <Route path={clientRoutes.emailSentUrl} element={<EmailVerificationSent />}></Route>
              <Route
                path={clientRoutes.sharedDealUrl + '/:senderEmail/:dealId'}
                element={<Calculator />}
              />
            </Routes>
          </div>
        </PopupContextProvider>
      </InvestmentInputProvider>
    </NotificationProvider>
  )
}

export default App
