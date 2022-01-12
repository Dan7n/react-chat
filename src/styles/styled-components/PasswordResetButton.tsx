import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const PasswordResetButton = styled(Button)({
  backgroundColor: "#6247ea",
  color: "white",
  "&:hover": {
    backgroundColor: "hsl(249.93865030674849, 79.51219512195121%, 40%)",
  },
  "&:disabled": {
    backgroundColor: "#9caaa9",
    color: "#f9f9f9",
    cursor: "not-allowed",
  },
});
