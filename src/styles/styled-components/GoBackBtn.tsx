import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IGoBackBtn {
  to: string;
  color?: string;
  btnText?: string;
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
  color: ${props => props.color};
  svg {
    transform: rotate(180deg);
  }
  &:hover {
    color: white;
    background-color: ${props => props.color};
    gap: 0.4rem;
  }
`;

export const GoBackBtn = ({ to, color = "#6246ea", btnText = "Go back" }: IGoBackBtn) => {
  return (
    <StyledLink to={to} color={color}>
      <DoubleArrowRoundedIcon />
      {btnText}
    </StyledLink>
  );
};
