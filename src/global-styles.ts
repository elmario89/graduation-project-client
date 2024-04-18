import {css} from "@emotion/react";

const GlobalStyles = css`
    body {
      font-family: 'Roboto', sans-serif;
    }
    
    a {
      text-decoration: none;
        
      &.active {
          span {
              font-weight: 500;
          }
      }
    }
`;

export default GlobalStyles;