import styled from "styled-components";

interface IButtonProps {
  width?: string;
  bgColor?: string;
  hoverShadowColor?: string;
}

export const NormalButton = styled.button<IButtonProps>`
  --shadow-color: 0deg 0% 0%;

  width: ${props => props.width || "16.5rem"};
  height: 3rem;
  background-color: ${props => props?.bgColor || "white"};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: ${props => (props.bgColor ? "white" : "black")};
  box-shadow: 0px 0.4px 0.5px hsl(var(--shadow-color) / 0.09), 0px 1.3px 1.6px -0.7px hsl(var(--shadow-color) / 0.1),
    -0.1px 3.1px 3.7px -1.3px hsl(var(--shadow-color) / 0.11), -0.2px 7.2px 8.6px -2px hsl(var(--shadow-color) / 0.13);
  transition: all 300ms ease;

  &:hover {
    --shadow-color: 251deg 68% 36%;
    transform: scale(1.01);
    box-shadow: 0px 0.4px 0.4px hsl(var(--shadow-color) / 0.09), 0px 1.3px 1.3px -0.4px hsl(var(--shadow-color) / 0.08),
      -0.1px 2.3px 2.4px -0.9px hsl(var(--shadow-color) / 0.08), -0.1px 3.9px 4px -1.3px hsl(var(--shadow-color) / 0.08),
      -0.1px 6.6px 6.8px -1.8px hsl(var(--shadow-color) / 0.07),
      -0.2px 10.7px 11px -2.2px hsl(var(--shadow-color) / 0.07),
      -0.4px 16.6px 17.1px -2.7px hsl(var(--shadow-color) / 0.06),
      -0.5px 24.9px 25.6px -3.1px hsl(var(--shadow-color) / 0.06);
  }
`;

export {};
