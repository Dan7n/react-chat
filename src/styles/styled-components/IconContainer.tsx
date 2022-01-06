import styled from "styled-components";

interface IContainer {
  bg?: string;
  bgHover?: string;
}

const Container = styled.div<IContainer>`
  height: 2.5rem;
  width: 2.5rem;
  display: grid;
  place-items: center;
  padding: 0.4rem;
  background-color: ${props => props.bg || "#c7d2fe"};
  transition: background-color ease 300ms;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.bgHover || "#e0e7ff"};
  }

  svg {
    padding: 0;
    margin: 0;
  }
`;

export const IconContainer = ({ children }) => {
  return <Container>{children}</Container>;
};
