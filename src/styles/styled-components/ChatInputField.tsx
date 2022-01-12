import styled from "styled-components";

export const ChatInputField = styled.textarea`
  border-radius: 8px;
  border: 1px solid #ced4da;
  outline: none;
  max-height: 4.5rem;
  height: 3rem;
  resize: none;
  overflow: scroll;
  transition: all ease 300ms;
  padding: 4px;
  background-color: white;

  &:focus {
    border-color: var(--app-main-color);
    height: 4.5rem;
  }
`;
