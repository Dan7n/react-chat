import styled from "styled-components";
import { NormalButton } from "./Button";

export const GoogleButton = styled(NormalButton)`
  --shadow-color: 0deg 0% 0%;
  text-align: center;
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 1.5rem;
    transform: translate(-50%, -50%);
    width: 1.3rem;
    height: 1.3rem;
  }

  &:hover {
    --shadow-color: 218deg 75% 42%;
    transform: scale(1.01);
  }
`;
