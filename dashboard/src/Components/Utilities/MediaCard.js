import React from "react";
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography } from "@material-ui/core"


export default function MediaCard(props) {
  console.log(props)
  function onClk() {
    window.open(props.url, "_blank")
  }
  return (
    <Card sx={{ maxWidth: "2px", maxWidth: "20px", display: "inline-block" }}>

      <CardMedia
        component="img"
        height="1"
        style={{ height: "100%", width: "40%", justifyContent: "center" }}
        image={props.image}
        alt={props.alt}
      />
      <CardActions>
        <Button
          size="medium"
          onClick={
            props.action === "View API analytics" ? onClk : () => { props.setOpen(true) }
          }
        >
          {props.action}
        </Button>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>

    </Card>
  );
}