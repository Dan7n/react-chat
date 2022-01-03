import styled from "styled-components";
import { JsxChild } from "typescript";

interface IBlobProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color: string;
  delay?: string;
  transformTranslate?: string;
}

export const BlurredBlobs = ({ children }: any) => {
  return (
    <BlobContainer>
      {children}
      <Blob color="#BCA5FF" top="0" left="30px" />
      <Blob color="#ff748e" delay={"400ms"} top="5rem" left="7rem" />
      <Blob color="#FEC81B" delay={"400ms"} top="0" right="30px" />
    </BlobContainer>
  );
};

const BlobContainer = styled.div`
  position: relative;
  margin-top: 3rem;
  width: 36rem;
  height: 28rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Blob = styled.div<IBlobProps>`
  position: absolute;
  top: ${props => props.top || 0};
  ${props => props.left && { left: props.left }};
  ${props => props.right && { right: props.right }};
  ${props => props.bottom && { right: props.bottom }};
  background-color: ${props => props.color};
  height: 18rem;
  width: 18rem;
  border-radius: 50%;
  transition: all 400s ease-in-out;
  animation-duration: 9s;
  animation-iteration-count: infinite;
  animation-delay: ${props => props.delay || 0};
  mix-blend-mode: multiply;
  transform: translate(${props => props.transformTranslate || "0, 0"});
  animation-name: scale-up-down;
  filter: blur(65px) opacity(0.6);

  z-index: 1;

  @keyframes scale-up-down {
    0% {
      transform: scale(1);
    }
    33% {
      transform: scale(1.3);
    }
    66% {
      transform: scale(0.9);
    }
    99% {
      transform: scale(1);
    }
  }
`;
