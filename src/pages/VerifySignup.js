import React, { useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import AuthReusableComponent from 'components/AuthReusableComponent'
import { setAuthToken } from 'services/LocalStorage/LocalStorageServices'
import { dealListingUrl, loginUrl } from 'constants/clientRouteConstants'
import { VerifySignupService } from 'services/authServices'
import { useNotification } from 'context/Notification'
function VerifySignup(props) {
  const navigate = useNavigate()
  const { setUserData } = useContext(UserContext)
  console.log('setUserData', setUserData)
  const params = useParams()
  const { verifySignupApiState, verifySignup } = VerifySignupService()
  const showNotification = useNotification()
  useEffect(() => {
    const payload = {
      verificationToken: params.emailVerifyString,
    }
    console.log('verificationTokenPayload', payload)
    const onVerifySignupSuccess = (responseData) => {
      setAuthToken(responseData.token)

      showNotification({ type: 'success', text: 'Signup successful' })
      navigate(loginUrl)
    }

    const onVerifySignupFail = (errorString) => {
      showNotification({ type: 'error', text: errorString })
      navigate(loginUrl)
    }

    verifySignup(payload, onVerifySignupSuccess, onVerifySignupFail)
  }, [])

  return (
    <AuthReusableComponent heading="">
      <div className="verifyingText">Verifying your account</div>
      <div className="thankyouText">Thank you for your patience</div>
    </AuthReusableComponent>
  )
}

export default VerifySignup
