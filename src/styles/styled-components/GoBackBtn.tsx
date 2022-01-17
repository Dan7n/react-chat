import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IGoBackBtn {
  to: string;
}

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.4rem;
  border-radius: 8px;
  margin-right: 1rem;
  transition: all ease-in-out 200ms;
  gap: 0;
  color: #6246ea;
  svg {
    transform: rotate(180deg);
  }
  &:hover {
    color: white;
    background-color: #6246ea;
    gap: 0.4rem;
  }
`;

export const GoBackBtn = ({ to }: IGoBackBtn) => {
  return (
    <StyledLink to={to}>
      <DoubleArrowRoundedIcon />
      Go back
    </StyledLink>
  );
};
