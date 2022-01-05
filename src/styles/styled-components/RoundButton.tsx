import styled from "styled-components";
import React from "react";

interface IButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  buttonText?: string;
  bgColor?: string;
  bgColorHover?: string;
  width?: string;
}

const Button = styled.button<IButtonProps>`
  top: 40px;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 2px;
  color: ${props => (props.bgColor ? "white" : "#6246ea")};
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  border: 1px solid ${props => (props.bgColor === "#111D5E" ? "white" : props.bgColor) || "#6246ea"};
  border-radius: 50px;
  position: relative;
  overflow: hidden !important;
  transition: all 0.3s ease-in-out;
  background: ${props => props.bgColor || "transparent"};
  padding: 0.9rem 4rem;
  width: ${props => props.width || "80%"};
  position: relative;
  display: inline-block;
  z-index: 10;
  &:hover {
    border: 1px solid ${props => props.bgColor || "#6246ea"};
    color: white;
    &::before {
      opacity: 1;
      width: 116%;
    }
    &::after {
      opacity: 1;
      width: 120%;
    }
  }
  &::before {
    content: "";
    width: 0%;
    height: 100%;
    display: block;
    background: ${props => props.bgColorHover || "#6246ea"};
    position: absolute;
    transform: skewX(-20deg);
    left: -10%;
    opacity: 1;
    top: 0;
    z-index: -12;
    transition: all 0.7s cubic-bezier(0.77, 0, 0.175, 1);
    box-shadow: 2px 0px 14px rgba(0, 0, 0, 0.6);
  }
  &:after {
    content: "";
    width: 0%;
    height: 100%;
    display: block;
    background: #1f2f4a;
    position: absolute;
    transform: skewX(-20deg);
    left: -10%;
    opacity: 0;
    top: 0;
    z-index: -15;
    transition: all 0.4s cubic-bezier(0.2, 0.95, 0.57, 0.99);
    box-shadow: 2px 0px 14px rgba(0, 0, 0, 0.6);
  }
`;

export const RoundButton = props => {
  const { buttonText, bgColor, bgColorHover } = props;
  return (
    <Button bgColor={bgColor} bgColorHover={bgColorHover} {...props}>
      <span>{buttonText}</span>
    </Button>
  );
};
