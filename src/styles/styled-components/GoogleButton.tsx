import styled from "styled-components";
import { NormalButton } from "./Button";

export const GoogleButton = styled(NormalButton)`
  --shadow-color: 0deg 0% 0%;
  display: grid;
  grid-template-columns: 25% 75%;
  place-items: center;

  &:hover {
    --shadow-color: 218deg 75% 42%;
    transform: scale(1.01);
  }
`;
