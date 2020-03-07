import styled, { css } from 'styled-components';
import { DebounceInput } from 'react-debounce-input';

export const globalStyles = css``;

export const NavBarWrapper = styled.header`
  height: 50px;

  nav {
    background: aliceblue;
    .nav-brand h3 a {
      border: 0;
      color: forestgreen;
      font-weight: bold;
    }
  }
`;

export const SearchBar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 5px 0 15px 0;
`;

export const SearchInput = styled(DebounceInput).attrs({
  type: 'search',
})`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  width: 80vw;
  max-width: 500px;

  @media only screen and (min-width: 1024px) {
    max-width: 600px;
  }
`;

export const SearchInfo = styled.div`
  font-size: 18px;
`;


export const SearchResults = styled.ul.attrs({
  className: 'padding-left',
})`
  display: flex;
  flex-flow: column wrap;
  height: 50vh;
  width: 80vw;

  @media only screen and (max-width: 480px) {
    flex-wrap: nowrap;
  }
`;
