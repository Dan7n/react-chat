import styled from "styled-components";
import InputEmoji from "react-input-emoji";

const ChatFieldContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  max-height: 4.5rem;
`;

export const ChatFieldInput = props => {
  return (
    <ChatFieldContainer>
      <InputEmoji {...props} />
    </ChatFieldContainer>
  );
};
