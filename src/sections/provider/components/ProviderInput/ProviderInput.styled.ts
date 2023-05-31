import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.label<{ error?: boolean }>`
  padding: 12px 18px 20px 18px;
  margin-top: 10px;
  margin-left: -10px;
  margin-right: -10px;

  display: flex;
  align-items: center;
  gap: 8px;

  transition: ${theme.transitions.default};

  background: ${theme.colors.backgroundGray1000};
  border-radius: 9px;
  border-bottom: 1px solid ${(p) => (p.error ? theme.colors.error : "none")};

  :focus,
  :focus-visible,
  :focus-within,
  :hover {
    outline: none;

    cursor: text;

    background: ${theme.colors.backgroundGray700};

    border-bottom: 1px solid
      ${({ error }) => (error ? theme.colors.error : "none")};
  }

  @media ${theme.viewport.gte.sm} {
    padding: 8px;
  }
`

export const SInput = styled.input`
  all: unset;
  color: ${theme.colors.white};

  font-size: 12px;

  width: 100%;

  transition: ${theme.transitions.default};

  ::placeholder {
    color: rgba(${theme.rgbColors.white}, 0.4);
    font-size: 12px;
  }

  :focus-visible {
    outline: none;
  }
`
