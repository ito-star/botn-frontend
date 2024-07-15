import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/system'

function createData(label, year1, year2, year3, year4, year5, year6, year7, year8) {
  return { label, year1, year2, year3, year4, year5, year6, year7, year8 }
}

const CustomTableContainer = styled(TableContainer)({
  border: '1px solid #d9d9d9',
})

const CustomTableCell = styled(TableCell)({
  fontSize: '0.55rem',
  lineHeight: '1rem',
  padding: '0.1rem 0.5rem',
  // border: '1px solid rgb(239 238 238)',
  fontWeight: 600,
  '&.header': {
    color: '#999898',
  },
  '&.first': {
    borderRight: '1px solid #d9d9d9',
  },
  '&.sub': {
    paddingLeft: '2rem',
    fontWeight: '400',
  },
})

const rows = [
  createData('Revenue', '', '', '', '', '', '', ''),
  createData('Gross Income', '', '', '', '', '', '', ''),
  createData('Rent', '', '', '', '', '', '', ''),
  createData('Other Income', '', '', '', '', '', '', ''),
  createData('Expenses', '', '', '', '', '', '', ''),
  createData('Maintenance', '', '', '', '', '', '', ''),
  createData('Net Income', '', '', '', '', '', '', ''),
  createData('Other', '', '', '', '', '', '', ''),
  createData('Total Expense', '', '', '', '', '', '', ''),
  createData('Net Income', '', '', '', '', '', '', ''),
  createData('Loan', '', '', '', '', '', '', ''),
  createData('Pretax Cash Flow', '', '', '', '', '', '', ''),
  createData('Principle Redocio(?)', '', '', '', '', '', '', ''),
  createData('Cash', '', '', '', '', '', '', ''),
  createData('Cash Flow After Taxes', '', '', '', '', '', '', ''),
]

export default function IncomeStatementTable() {
  const subIndices = [0, 4, 8]
  return (
    <CustomTableContainer component={'div'}>
      <Table sx={{ minWidth: '55%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <CustomTableCell className="header first"></CustomTableCell>
            <CustomTableCell className="header">Year 1</CustomTableCell>
            <CustomTableCell className="header" align="left">
              Year 2
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              Year 3
            </CustomTableCell>
            <CustomTableCell className="header" align="left">
              Year 4
            </CustomTableCell>
            <CustomTableCell className="header">Year 5</CustomTableCell>
            <CustomTableCell className="header">Year 6</CustomTableCell>
            <CustomTableCell className="header">Year 7</CustomTableCell>
            <CustomTableCell className="header">Year 8</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <CustomTableCell
                component="th"
                scope="row"
                className={'first' + (subIndices.includes(index) ? '' : ' sub')}
              >
                {row.label}
              </CustomTableCell>
              <CustomTableCell component="th" scope="row">
                {row.year1}
              </CustomTableCell>
              <CustomTableCell align="left">{row.year2}</CustomTableCell>
              <CustomTableCell align="left">{row.year3}</CustomTableCell>
              <CustomTableCell align="left">{row.year4}</CustomTableCell>
              <CustomTableCell align="left">{row.year5}</CustomTableCell>
              <CustomTableCell align="left">{row.year6}</CustomTableCell>
              <CustomTableCell align="left">{row.year7}</CustomTableCell>
              <CustomTableCell align="left">{row.year8}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomTableContainer>
  )
}
