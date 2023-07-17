import Page from "@/components/Page";
import React from "react";
import Back from "@/components/Back";
import { TextField, Box } from "@mui/material";

export default function Recents() {
  return (
    <Page>
      <div> Rectnts </div>
      <Box sx={{ padding: 2 }}>
        <div>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </div>
        <div>text will be cache when the History POP</div>
      </Box>
      <Back />
    </Page>
  );
}
