import React, { useState, useEffect, useContext } from 'react'
import PopupBackground from './PopupBackground'
import styled from 'styled-components'
import TextField from '../TextField'
import { Flex, Button, TextArea, TextWithIcon } from '../CommonStyles'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'
import { isNumberValid } from 'utils/inputFormatter'
import { UserContext } from 'context/UserContext'
import { AddDealService, UpdateDealService } from 'services/dealServices'
import { useNotification } from 'context/Notification'
import { useNavigate } from 'react-router-dom'
import { dealListingUrl, loginUrl } from 'constants/clientRouteConstants'
import { TextWithToggleContainer } from '../../pages/Calculator/CalculatorStyles'
import CustomToggle from '../CustomToggle'
const BottomContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  box-shadow: 0px 1px 3px rgb(110, 110, 110);
`

const Header = styled.div`
  font-weight: 600;
  text-align: center;
  padding: 1rem 0;
`
const Content = styled.div`
  // height:17.25rem;
  padding: 0 1rem;
`

function AddToDatabasePopup({ onClose, width }) {
  const { investmentSummary, getAllInputs, dealInfo } = useContext(InvestmentInputContext)
  const { userData, setUserData } = useContext(UserContext)
  const [dealName, setDealName] = useState(dealInfo?.dealName)
  const [dealNameError, setDealNameError] = useState(false)
  const [address, setAddress] = useState(dealInfo?.address)
  const [yearBuilt, setYearBuilt] = useState(dealInfo?.yearBuilt)
  const [yearBuiltError, setYearBuiltError] = useState()
  const [propertyType, setPropertyType] = useState(dealInfo?.propertyType)
  const [state, setState] = useState(dealInfo?.state)
  const [city, setCity] = useState(dealInfo?.city)
  const [notes, setNotes] = useState(dealInfo?.notes)
  // const [createdBy, setCreatedBy] = useState(dealInfo?.createdBy);
  const [isDealPrivate, setIsDealPrivate] = useState(
    dealInfo?.isDealPrivate !== undefined ? dealInfo.isDealPrivate : true
  )
  const showNotification = useNotification()
  const navigate = useNavigate()
  const { addDeal, setAddDealApiState } = AddDealService()
  const { updateDeal, setUpdateDealApiState } = UpdateDealService()
  const onAddDealSuccess = (dealId) => {
    showNotification({ type: 'success', text: 'Added Successfully' })
    setUserData((prevUserData) => {
      const newUserData = { ...prevUserData }
      const deal = getDeal()
      deal._id = dealId
      deal.timestamp = new Date()
      if (userData?.deals?.length) {
        newUserData.deals = [deal, ...userData.deals]
      } else {
        newUserData.deals = [deal]
      }
      return newUserData
    })
    navigate(dealListingUrl)
    onClose()
  }

  const onAddDealFailure = (statusCode) => {
    if (statusCode === 401) {
      navigate(loginUrl)
    }
    showNotification({ type: 'error', text: 'Something went wrong' })
  }

  const onUpdateDealSuccess = () => {
    showNotification({ type: 'success', text: 'Updated Successfully' })
    setUserData((prevUserData) => {
      const newUserData = { ...prevUserData }
      const newDeal = getDeal()
      newDeal._id = dealInfo._id
      newDeal.timestamp = new Date()
      newUserData.deals = userData.deals.map((deal) => {
        if (deal._id == dealInfo._id) {
          return newDeal
        }
        return deal
      })
      return newUserData
    })
    navigate(dealListingUrl)
    onClose()
  }

  const onUpdateDealFailure = (statusCode) => {
    if (statusCode === 401) {
      navigate(loginUrl)
    }
    showNotification({ type: 'error', text: 'Something went wrong' })
  }

  const getDeal = () => {
    return {
      dealInfo: {
        dealName,
        address,
        yearBuilt,
        propertyType,
        state,
        city,
        notes,
        isDealPrivate,
      },
      dealCalculationInfo: getAllInputs(),
      irr: investmentSummary.IRR,
    }
  }

  const handleSave = () => {
    console.log(dealName, address, yearBuilt, propertyType, state, city, notes, investmentSummary)
    if (isAllInputValid()) {
      const payload = {
        deal: getDeal(),
      }
      console.log('payload', payload, dealInfo)
      if (dealInfo == null) {
        addDeal(payload, onAddDealSuccess, onAddDealFailure)
      } else {
        payload.deal_id = dealInfo._id
        updateDeal(payload, onUpdateDealSuccess, onUpdateDealFailure)
      }
    }
  }

  const isAllInputValid = () => {
    const isDealNameValid = dealName?.length > 0
    const isYearBuiltValid =
      yearBuilt == undefined || (isNumberValid(yearBuilt) && yearBuilt.length == 4)
    if (isDealNameValid && isYearBuiltValid) {
      console.log('Add to DB')
      return true
    } else {
      setDealNameError(!isDealNameValid)
      setYearBuiltError(!isYearBuiltValid)
      return false
    }
  }

  return (
    <PopupBackground width={width}>
      <Header>Add To Deal Database</Header>
      <Content>
        <>
          <Flex>
            <TextField
              label="Deal Name"
              placeholder="X"
              value={dealName}
              error={dealNameError}
              onChange={(value) => setDealName(value)}
            />
            <TextField
              label="Address"
              placeholder="X"
              value={address}
              onChange={(value) => setAddress(value)}
            />
          </Flex>
          <Flex pt={'0.5rem'}>
            <TextField
              label="Year Built"
              placeholder="X"
              value={yearBuilt}
              error={yearBuiltError}
              onChange={(value) => setYearBuilt(value)}
            />
            <TextField
              label="Type"
              placeholder="X"
              value={propertyType}
              onChange={(value) => setPropertyType(value)}
            />
            <TextField
              label="State"
              placeholder="X"
              value={state}
              onChange={(value) => setState(value)}
            />
            <TextField
              label="City"
              placeholder="X"
              value={city}
              onChange={(value) => setCity(value)}
            />
          </Flex>
          <Flex pt={'0.5rem'}>
            <TextArea
              h={'5rem'}
              placeholder="Notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            ></TextArea>
          </Flex>
          <Flex pt={'0.5rem'}>
            <TextWithToggleContainer>
              <div className="Text">Is deal private?</div>
              <CustomToggle value={isDealPrivate} setValue={setIsDealPrivate} />
            </TextWithToggleContainer>
            {/* <TextField
            // label="Created By"
            // placeholder="X"
            // value={createdBy}
            // onChange={(value) => setCreatedBy(value)}
            /> */}
            <div style={{ flex: 1 }}></div>
          </Flex>
        </>
      </Content>

      <BottomContainer>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="white" backgroundColor="#4fd165" onClick={handleSave}>
          Save
        </Button>
      </BottomContainer>
    </PopupBackground>
  )
}

export default AddToDatabasePopup
