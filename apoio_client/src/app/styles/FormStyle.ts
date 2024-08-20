import styled from 'styled-components'

export const FormLogin = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const FormFieldLogin = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;

  input {
    width: 100%;
    padding: 0.8rem 2rem 0.8rem 0.5rem;
    border-radius: 5px;
    font-size: 1rem;
    border: none;
    outline: none;
    background: none;
  }

  input::placeholder {
    color: var(--cor-shadow-mid);
    font-size: 1rem;
  }

  svg {
    position: absolute;
    right: 5px;color: var(--cor-shadow-mid);
    font-size: 1.2rem;
    cursor: pointer;
    user-select: none;
  }
`;