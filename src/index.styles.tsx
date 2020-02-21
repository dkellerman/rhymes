import { css } from 'styled-components';

export const globalStyles = css`
  nav {
    background: aliceblue;
  }

  header {
    height: 50px;
  }

  input[type=search] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 80vw;
    max-width: 310px;
  }

  ul.results {
    display: flex;
    flex-flow: column wrap;
    min-height: 50vh;
    max-height: 70vh;
    width: 80vw;
 }

  @media only screen and (max-width: 480px) {
    ul.results {
      flex-wrap: nowrap;
    }
  }

  @media only screen and (max-width: 768px) {
    header {
      height: 100px;
    }
  }

  @media only screen and (min-width: 1024px) {
    input[type=search] {
      max-width: 600px;
    }
  }
`;
