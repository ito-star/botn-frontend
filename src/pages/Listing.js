import { UserDetailsWithMenu } from 'components/CalculatorPage/UserDetailsWithMenu'
import { calculatorUrl, loginUrl } from 'constants/clientRouteConstants'
import { InvestmentInputContext } from 'context/InvestmentInputContext'
import { useNotification } from 'context/Notification'
import { UserContext } from 'context/UserContext'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteDealService } from 'services/dealServices'
import styled from 'styled-components'
import Container from '../components/Container'
import { SortMenu } from '../components/DealsPage/SortMenu'
import DeletePopup from '../components/Popups/DeleteDealPopup'
import { PopupContext } from '../context/PopupContext'
import { GetAllSharedUserDealsService } from '../services/dealServices'
import { unformatRate } from '../utils/inputFormatter'
import { CenterWrapper } from './Calculator/CalculatorStyles'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 3rem;
`

const SearchContainer = styled.div`
  width: 25rem;
  height: 3rem;
  background: white;
  border-radius: 0.5rem;
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  padding-left: 3rem;

  &:focus {
    outline: none;
  }
`

const SearchIcon = styled.img`
  width: 1.2rem;
  opacity: 0.5;
  position: absolute;
  top: 0.85rem;
  left: 1rem;
`

const Logo = styled.img`
  width: 11rem;
`

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
  margin-bottom: 2rem;
`
const Left = styled.div`
  flex: 1;
  margin-right: 2rem;
  display: flex;
  flex-direction: column;
  /* height:100%; */
`

const SortAndFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleAndSortContainer = styled.div`
  display: flex;
  align-items: flex-end;
`
const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-right: 3rem;
  line-height: 1.2rem;
`

const Right = styled.div`
  width: 13rem;
  display: flex;
`
const FilterContainer = styled.div`
  width: 7rem;
  background-color: white;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`
const FilterImg = styled.img`
  width: 0.9rem;
`
const FilterText = styled.div`
  font-size: 0.8rem;
  margin-left: 0.8rem;
`

const TabContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
`
const TabItem = styled.div`
  background: ${(props) => (props.active ? 'black' : 'white')};
  border: 1px solid gray;
  padding: 0.3rem 1rem;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: ${(props) => (props.active ? 'white' : 'black')};
  cursor: pointer;
  transition: all 0.2s;
`

const ListContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  font-size: 0.8rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ListHeader = styled.div`
  width: 100%;
  background: white;
  height: 3rem;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  align-items: center;
`
const HR = styled.hr`
  padding: 0;
  margin: 0;
  border-top: 1px solid #eeeded;
`
const ListItemsContainer = styled.div`
  flex: 1;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  background: white;
`

const ListItem = styled.div`
  width: 100%;
  background: white;
  height: 3rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.01);
    z-index: 1;
    box-shadow: 0px 5px 10px #eeeded;
  }
`

const DealName = styled.div`
  /* width:100%;
background:white; */
  margin-left: 1rem;
  flex: 1;
  &.header {
    font-weight: 600;
    font-size: 0.8rem;
  }
`

const DateCreated = styled.div`
  /* width:100%;
background:white; */
  margin-left: 1rem;
  flex: 1;
  &.header {
    font-weight: 600;
    font-size: 0.8rem;
  }
`

const Blank = styled.div`
  width: 2.4rem;
  margin: 0 2rem;
`

const ShareIcon = styled.img`
  width: 1.2rem;
  margin: 0 1rem;
  transition: all 0.2s;
  &:hover {
    filter: invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%)
      contrast(117%);
  }
`

const IRR = styled.div`
  flex: 1;
  &.header {
    font-weight: 600;
  }
`

const SharedBy = styled.div`
  flex: 2;
  &.header {
    font-weight: 600;
  }
`

const AddNewDealButton = styled.div`
  width: 100%;
  padding: 0.5rem;
  background: white;
  text-align: center;
  align-self: flex-end;
  justify-self: center;
  color: white;
  border-radius: 0.5rem;
  background-color: var(--theme-color);
  cursor: pointer;
`

const Listing = () => {
  const navigate = useNavigate()
  const { userData, setUserData } = useContext(UserContext)
  const { setDeal, setDealInfo, resetDealData } = useContext(InvestmentInputContext)
  const { setSharePopupOpen } = useContext(PopupContext)
  const [filteredDeals, setFilteredDeals] = useState(userData?.deals)
  const [sharedDeals, setSharedDeals] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const { deleteDeal, deleteDealApiState } = DeleteDealService()
  const [currentSortOption, setCurrentSortOption] = useState('Newest first')
  const { getAllSharedDealsOfUser, getAllSharedDealsOfUserApiState } =
    GetAllSharedUserDealsService()
  const showNotification = useNotification()
  const [tabIndex, setTabIndex] = useState(0)
  const sharedDealsRef = useRef([])

  useEffect(() => {
    if (tabIndex === 0) {
      setFilteredDeals(() => {
        return getSortedAndFilteredList(userData?.deals, currentSortOption, searchInput)
      })
    } else {
      setSharedDeals(() => {
        return getSortedAndFilteredList(sharedDealsRef.current, currentSortOption, searchInput)
      })
    }
  }, [searchInput, userData.deals, tabIndex, sharedDealsRef.current, currentSortOption])

  const getSortedAndFilteredList = (list, sortType, searchString) => {
    if (list === null || list === undefined) {
      return []
    }
    const filteredList = list.filter((dealItem) => {
      return dealItem.dealInfo.dealName.toLowerCase().includes(searchString.toLowerCase())
    })
    const sortFunction = getSortFunction(sortType)
    return filteredList.sort(sortFunction)
  }

  const getSortFunction = (sortType) => {
    switch (sortType) {
      case 'Newest first':
        return (item1, item2) => {
          return new Date(item1.timestamp) < new Date(item2.timestamp) ? 1 : -1
        }
      case 'Oldest first':
        return (item1, item2) => {
          console.log('Irr asc', item1.timestamp, item2.timestamp)
          return new Date(item1.timestamp) > new Date(item2.timestamp) ? 1 : -1
        }
      case 'IRR ascending':
        return (item1, item2) => {
          return unformatRate(item1.irr) > unformatRate(item2.irr) ? 1 : -1
        }
      case 'IRR descending':
        return (item1, item2) => {
          return unformatRate(item1.irr) < unformatRate(item2.irr) ? 1 : -1
        }
    }
  }

  useEffect(() => {
    const getSharedDealsSuccess = (sharedDealsArray) => {
      sharedDealsRef.current = sharedDealsArray
      setSharedDeals(sharedDealsArray)
    }
    const getSharedDealsFailed = () => {
      showNotification({ type: 'error', text: 'something went wrong' })
    }
    if (tabIndex == 1 && sharedDeals == null) {
      getAllSharedDealsOfUser({}, getSharedDealsSuccess, getSharedDealsFailed)
    }
  }, [tabIndex])

  const handleAddDeal = () => {
    setDealInfo(null)
    resetDealData()
    navigate(calculatorUrl)
  }
  const handleListItemClick = (deal) => {
    setDeal(deal)
    navigate(calculatorUrl)
  }

  // const getSortedDeal = () => {
  //   // if (sort == "latest") {
  //   //   setSortedDeal(() => {
  //   //     // return userData.deals.sort(a,b)
  //   //   })
  //   // }
  // }

  const onDeleteSuccess = (dealId) => {
    setUserData((prevUserData) => {
      console.log('dealId', dealId)
      const newUserData = { ...prevUserData }
      newUserData.deals = userData.deals.filter((deal) => {
        return deal._id != dealId
      })
      return newUserData
    })
    showNotification({ type: 'success', text: 'Deleted successfully' })
  }

  const onDeleteFail = () => {
    console.log('failed')
    showNotification({ type: 'error', text: 'Something went wrong' })
  }
  const handleDeleteDeal = (e, dealId, handleClose) => {
    e.preventDefault()
    e.stopPropagation()
    const payload = { deal_id: dealId }
    console.log(payload)
    deleteDeal(
      payload,
      () => {
        onDeleteSuccess(dealId)
        handleClose(e)
      },
      onDeleteFail
    )
  }

  const getFormattedTimestamp = (dateString) => {
    const dateObject = new Date(dateString)
    const date = dateObject.getDate()
    const month = dateObject.toLocaleString('default', { month: 'short' })
    const year = dateObject.getFullYear()
    return date + ' ' + month + ', ' + year
  }

  const handleShareDeal = (e, deal) => {
    e.preventDefault()
    e.stopPropagation()
    setDeal(deal)
    console.log('setShare')
    setSharePopupOpen(true)
  }

  return (
    <CenterWrapper>
      <Container>
        <Content>
          <Left>
            <Header>
              <Logo src="/images/Logo.svg" />
              <UserDetailsWithMenu />
            </Header>
            <SortAndFilterContainer>
              <TitleAndSortContainer>
                <Title>Deals</Title>
                <SortMenu
                  setCurrentSortOption={setCurrentSortOption}
                  currentSortOption={currentSortOption}
                />
              </TitleAndSortContainer>
              <SearchContainer className="SearchContainer">
                <SearchInput
                  placeholder="search for saved calculations"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <SearchIcon src="/images/search.png" />
              </SearchContainer>
              <FilterContainer>
                <FilterImg src="/images/filter.png" />
                <FilterText>Filters</FilterText>
              </FilterContainer>
            </SortAndFilterContainer>
            <TabContainer>
              <TabItem active={tabIndex == 0} onClick={() => setTabIndex(0)}>
                My Deals
              </TabItem>
              <TabItem active={tabIndex == 1} onClick={() => setTabIndex(1)}>
                Shared Deals
              </TabItem>
            </TabContainer>
            <ListContainer>
              {tabIndex == 0 && (
                <>
                  <ListHeader>
                    <DealName className="header">DEAL NAME</DealName>
                    <DateCreated className="header">DATE CREATED</DateCreated>
                    <IRR className="header">IRR</IRR>

                    <Blank></Blank>
                  </ListHeader>
                  <HR />
                  <ListItemsContainer>
                    {filteredDeals &&
                      filteredDeals.map((deal) => (
                        <>
                          <ListItem onClick={() => handleListItemClick(deal)}>
                            <DealName>{deal.dealInfo.dealName}</DealName>
                            <DateCreated>{getFormattedTimestamp(deal.timestamp)}</DateCreated>
                            <IRR>{deal.irr}</IRR>
                            <ShareIcon
                              src="/images/share_blue.svg"
                              onClick={(e) => handleShareDeal(e, deal)}
                            />
                            <DeletePopup
                              dealId={deal._id}
                              dealName={deal.dealInfo.dealName}
                              handleDeleteDeal={handleDeleteDeal}
                            />
                            {/* <DeleteIcon src="/images/delete.png" onClick={(e) => handleDeleteDeal(e, deal._id)} /> */}
                          </ListItem>
                          <HR />
                        </>
                      ))}
                  </ListItemsContainer>
                </>
              )}

              {tabIndex == 1 && (
                <>
                  <ListHeader>
                    <DealName className="header">DEAL NAME</DealName>
                    <DateCreated className="header">DATE CREATED</DateCreated>
                    <IRR className="header">IRR</IRR>
                    <SharedBy className="header">SHARED BY</SharedBy>
                    {/* <Blank></Blank> */}
                  </ListHeader>
                  <HR />
                  <ListItemsContainer>
                    {sharedDeals &&
                      sharedDeals.map((deal) => (
                        <>
                          <ListItem
                            onClick={() => {
                              deal.isSharedDeal = true
                              handleListItemClick(deal)
                            }}
                          >
                            <DealName>{deal.dealInfo.dealName}</DealName>
                            <DateCreated>{getFormattedTimestamp(deal.timestamp)}</DateCreated>
                            <IRR>{deal.irr}</IRR>
                            <SharedBy>{deal.dealInfo.sharedBy}</SharedBy>
                          </ListItem>
                          <HR />
                        </>
                      ))}
                  </ListItemsContainer>
                </>
              )}
            </ListContainer>
          </Left>
          <Right>
            <AddNewDealButton onClick={handleAddDeal}>Add</AddNewDealButton>
          </Right>
        </Content>
      </Container>
    </CenterWrapper>
  )
}

export default Listing
