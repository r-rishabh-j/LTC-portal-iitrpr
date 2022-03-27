import {Box, Card, CardActions, CardContent, CardMedia, Button, Typography} from "@material-ui/core"

export default function MediaCard(props) {
    console.log(props)
  return (
    <Card sx={{ maxWidth: 400 }}>
      <center>
        <CardMedia
          component="img"
          height="260"
          style={{ height: "100%", width: "66%", justifyContent: "center" }}
          image={props.image}
          alt={props.alt}
        />

        <CardContent>
          {/* <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
        </CardContent>
        <CardActions>
          <Button size="medium">{props.action}</Button>
          {/* <Button size="small">Learn More</Button> */}
        </CardActions>
      </center>
    </Card>
  );
}