import { css } from 'styled-components';

export const globalStyles = css`
  body {
    font: 300 16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }

  input[type=search] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    padding: 8px;
    width: 90vw;
    max-width: 600px;
  }

  .info, .no-results {
    margin-top: 8px;
    font-size: small;
  }

  ul {
    display: flex;
    flex-flow: column wrap;
    height: 50vh;
    width: 33vw;
    padding-left: 25px;

    li {
      margin-bottom: 3px;
      padding: 5px;
      margin: 0 5px 5px 0;
    }
  }
`;
