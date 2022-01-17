import styled from "styled-components";
import InputEmoji from "react-input-emoji";

// export const ChatInputField = styled(InputEmoji)`
//   border-radius: 8px;
//   border: 1px solid #ced4da;
//   outline: none;
//   max-height: 4.5rem;
//   height: 3rem;
//   resize: none;
//   overflow: scroll;
//   transition: all ease 300ms;
//   padding: 4px;
//   background-color: white;

//   &:focus {
//     border-color: var(--app-main-color);
//     height: 4.5rem;
//   }
// `;

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
