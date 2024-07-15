import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { borderRadius, styled } from '@mui/system'
import { InputBase } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
const AutoCompleteInput = styled(InputBase, {
  name: 'AutoCompleteInput',
})({
  flex: 1,
  // border: '1px solid black'
})

const SearchContainer = styled('div', {
  name: 'SearchContainer',
})({
  display: 'flex',
  border: '1px solid gray',
  borderRadius: '0.5rem',
  padding: '0.25rem 0.5rem 0.25rem 1rem',
})

const AddButton = styled(IconButton, {
  name: 'AddButton',
})({
  background: 'whitesmoke',
})

export default function ControllableStates({
  searchText,
  setSearchText,
  listData,
  loading,
  onListItemClicked,
  onAdd,
}) {
  return (
    <div>
      <Autocomplete
        loading={loading}
        inputValue={searchText}
        onInputChange={(event, newInputValue) => {
          if (
            (event != null && event.type !== 'click' && event.type !== 'blur') ||
            newInputValue === ''
          ) {
            setSearchText(newInputValue)
          } else if (event != null && event.type !== 'blur') {
            onListItemClicked(newInputValue)
          }
        }}
        id="controllable-states-demo"
        options={listData}
        sx={{ width: 400 }}
        renderInput={(params) => {
          return (
            <SearchContainer>
              <AutoCompleteInput
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                label="Search email to send"
              />
              {/* <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton> */}
              <AddButton color="primary" sx={{ p: '8px' }} aria-label="directions" onClick={onAdd}>
                <AddCircleOutlineOutlinedIcon />
              </AddButton>
            </SearchContainer>
          )
        }}
      />
    </div>
  )
}

// import * as React from 'react';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import CircularProgress from '@mui/material/CircularProgress';

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

// export default function Asynchronous() {
//   const [open, setOpen] = React.useState(false);
//   const [options, setOptions] = React.useState([]);
//   const loading = open && options.length === 0;

//   React.useEffect(() => {
//     let active = true;

//     if (!loading) {
//       return undefined;
//     }

//     (async () => {
//       await sleep(1e3); // For demo purposes.

//       if (active) {
//         setOptions([...topFilms]);
//       }
//     })();

//     return () => {
//       active = false;
//     };
//   }, [loading]);

//   React.useEffect(() => {
//     if (!open) {
//       setOptions([]);
//     }
//   }, [open]);

//   return (
//     <Autocomplete
//       id="asynchronous-demo"
//       sx={{ width: 300 }}
//       filterOptions={(x) => x}
//       open={open}
//       onOpen={() => {
//         setOpen(true);
//       }}
//       onClose={() => {
//         setOpen(false);
//       }}
//       // isOptionEqualToValue={(option, value) => option.title === value.title}
//       getOptionLabel={(option) => option.title}
//       options={options}
//       loading={loading}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Asynchronous"
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <React.Fragment>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </React.Fragment>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// }

// // Top films as rated by IMDb users. http://www.imdb.com/chart/top
// const topFilms = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   {
//     title: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   {
//     title: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     title: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   {
//     title: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 },
//   { title: 'The Matrix', year: 1999 },
//   { title: 'Seven Samurai', year: 1954 },
//   {
//     title: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { title: 'City of God', year: 2002 },
//   { title: 'Se7en', year: 1995 },
//   { title: 'The Silence of the Lambs', year: 1991 },
//   { title: "It's a Wonderful Life", year: 1946 },
//   { title: 'Life Is Beautiful', year: 1997 },
//   { title: 'The Usual Suspects', year: 1995 },
//   { title: 'Léon: The Professional', year: 1994 },
//   { title: 'Spirited Away', year: 2001 },
//   { title: 'Saving Private Ryan', year: 1998 },
//   { title: 'Once Upon a Time in the West', year: 1968 },
//   { title: 'American History X', year: 1998 },
//   { title: 'Interstellar', year: 2014 },
// ];
