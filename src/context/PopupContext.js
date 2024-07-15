import { useContext } from 'react'
import AddToDatabasePopup from 'components/Popups/AddToDatabasePopup'
import DepreciationDefaultPopup from 'components/Popups/DepreciationDefaultPopup'
import LoginPopup from 'components/Popups/LoginPopup'
import RecurringAndNonrecurringExpensePopup from 'components/Popups/RecurringAndNonrecurringExpensePopup'
import RentalIncomeAndLeasePopup from 'components/Popups/RentalIncomeAndLeasePopup/RentalIncomeAndLeasePopup'
import React, { useState } from 'react'
import SharePopup from '../components/Popups/SharePopup'

export const PopupContext = React.createContext()

export const PopupContextProvider = ({ children }) => {
  const [rentalIncomeAndLeasePopupOpen, setRentalIncomeAndLeasePopupOpen] = useState(false)
  const [recurringExpensePopupOpen, setRecurringExpensePopupOpen] = useState(false)
  const [depreciationDefaultPopupOpen, setDepreciationDefaultPopupOpen] = useState(false)
  const [addToDatabasePopupOpen, setAddToDatabasePopupOpen] = useState(false)
  const [loginPopupOpen, setLoginPopupOpen] = useState(false)
  const [sharePopupOpen, setSharePopupOpen] = useState(false)
  return (
    <>
      <PopupContext.Provider
        value={{
          setRentalIncomeAndLeasePopupOpen,
          setAddToDatabasePopupOpen,
          setRecurringExpensePopupOpen,
          setDepreciationDefaultPopupOpen,
          setLoginPopupOpen,
          setSharePopupOpen,
        }}
      >
        {children}
        {recurringExpensePopupOpen && (
          <RecurringAndNonrecurringExpensePopup
            onClose={() => {
              setRecurringExpensePopupOpen(false)
            }}
          />
        )}
        {depreciationDefaultPopupOpen && (
          <DepreciationDefaultPopup
            onClose={() => {
              setDepreciationDefaultPopupOpen(false)
            }}
          />
        )}
        {rentalIncomeAndLeasePopupOpen && (
          <RentalIncomeAndLeasePopup
            onClose={() => {
              setRentalIncomeAndLeasePopupOpen(false)
            }}
          />
        )}
        {addToDatabasePopupOpen && (
          <AddToDatabasePopup
            width={'35rem'}
            onClose={() => {
              setAddToDatabasePopupOpen(false)
            }}
          />
        )}
        <LoginPopup
          loginPopupOpen={loginPopupOpen}
          onClose={() => {
            setLoginPopupOpen(false)
          }}
        />
        <SharePopup
          sharePopupOpen={sharePopupOpen}
          onClose={() => {
            setSharePopupOpen(false)
          }}
        />
      </PopupContext.Provider>
    </>
  )
}

export const usePopupContext = () => useContext(PopupContext)
