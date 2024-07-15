import Dialog from '@mui/material/Dialog'
import { useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import Divider from '@mui/material/Divider'
import SearchWithDropdown from '../SearchWithDropdown'
import { Chip } from '@mui/material'
import { FetchEmailListForSearchQuery, ShareDealService } from '../../services/dealServices'
import { useNotification } from '../../context/Notification'
import { isValidEmail } from '../../services/validators'
import { UserContext } from '../../context/UserContext'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'

const Container = styled('div', {
  name: 'Container',
})({
  width: '32rem',
  display: 'flex',
  flexDirection: 'column',
})

const Header = styled('div', {
  name: 'Header',
})({
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  margin: '0 1rem',
  fontWeight: '600',
})

const Content = styled('div', {
  name: 'Content',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '1rem',
})

const EmailListContainer = styled('div', {
  name: 'EmailListContainer',
})({
  flex: 1,
  width: '100%',
  margin: '1rem',
  '& .headingText': {},
})

const EmailList = styled('div', {
  name: 'EmailList',
})({
  border: '1px solid #000000',
  height: '10rem',
  padding: '1rem',
  marginTop: '0.5rem',
})

const EmailChip = styled(Chip)({
  padding: '5px',
  minWidth: '6rem',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
})

const ActionButtons = styled('div', {
  name: 'ActionButtons',
})({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
})

const CustomChip = styled(Chip)({
  padding: '5px',
  minWidth: '6rem',
  marginLeft: '1rem',
  fontWeight: '600',
})
function SharePopup({ sharePopupOpen, onClose }) {
  const { fetchEmailList, searchEmailApiState } = FetchEmailListForSearchQuery()
  const showNotification = useNotification()
  const [searchText, setSearchText] = useState('')
  const [emailListFromSearch, setEmailListFromSearch] = useState([])
  const [emailListToShare, setEmailListToShare] = useState([])
  const { userData } = useContext(UserContext)
  const { dealInfo, dealSharedToEmailArray } = useContext(InvestmentInputContext)
  const { shareDeal, shareDealApiState } = ShareDealService()
  const onShareSuccess = () => {
    showNotification({ type: 'success', text: 'Shared successfully' })
    onClose()
  }

  const onShareFailed = (failedEmails) => {
    showNotification({ type: 'error', text: 'Something went wrong' })
  }

  const handleShare = () => {
    const payload = {
      emailArrayToShare: emailListToShare,
      dealIdArray: [dealInfo._id],
      senderEmail: userData.email,
    }
    shareDeal(payload, onShareSuccess, onShareFailed)
  }

  const onEmailListItemClicked = (email) => {
    if (isValidEmail(email)) {
      if (email === userData.email) {
        showNotification({ type: 'error', text: 'same as your email' })
      } else if (dealSharedToEmailArray?.includes(email)) {
        showNotification({ type: 'error', text: 'Deal already shared with email' })
      } else {
        if (!emailListToShare.includes(email)) {
          setEmailListToShare((prevList) => {
            let newList = [...prevList]
            newList.push(email)
            return newList
          })
        } else {
          showNotification({ type: 'error', text: 'Already selected' })
        }
      }
    } else {
      showNotification({ type: 'error', text: 'Add a valid email' })
    }
  }

  const removeEmailFromShareList = (emailToRemove) => {
    console.log(emailToRemove, emailListToShare)

    setEmailListToShare((prevList) => {
      let newList = [...prevList]
      newList = newList.filter((email) => email !== emailToRemove)
      return newList
    })
  }

  const onFetchEmailListSuccess = (emailListResponse) => {
    const mappedEmailList = emailListResponse.map((item) => item.email)
    setEmailListFromSearch(mappedEmailList)
  }

  const onFetchEmailListFailed = () => {
    setEmailListFromSearch([])
  }

  useEffect(() => {
    fetchEmailList(searchText, onFetchEmailListSuccess, onFetchEmailListFailed)
  }, [searchText])

  return (
    <Dialog open={sharePopupOpen} onClose={onClose} maxWidth="lg">
      <Container>
        <Header>
          <div>Share</div>
        </Header>
        <Divider />
        <Content>
          <SearchWithDropdown
            setSearchText={setSearchText}
            loading={searchEmailApiState.loading}
            searchText={searchText}
            listData={emailListFromSearch}
            onListItemClicked={onEmailListItemClicked}
            onAdd={() => {
              onEmailListItemClicked(searchText)
            }}
          />
          <EmailListContainer>
            <div className="headingText">Email list to share</div>
            <EmailList>
              {emailListToShare.map((emailItem) => (
                <EmailChip
                  variant="outlined"
                  onDelete={() => removeEmailFromShareList(emailItem)}
                  label={emailItem}
                />
              ))}
            </EmailList>
          </EmailListContainer>
          <ActionButtons>
            <CustomChip label="Cancel" onClick={onClose} />
            <CustomChip label="Share" color="primary" onClick={handleShare} />
          </ActionButtons>
        </Content>
      </Container>
    </Dialog>
  )
}

export default SharePopup
