import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Box, requirePropFactory } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const HowTo = ({ permission }) => {
    var client = [
        {
            image: require('./HowToPics/upload_sign.png'),
            description: "Upload Signature"
        },
        {
            image: require('./HowToPics/Client/new_ltc.png'),
            description: "Create a new LTC application"
        },
        {
            image: require('./HowToPics/Client/view_ltc.png'),
            description: "View filled LTC Application"
        },
        {
            image: require('./HowToPics/Client/past_ltc.png'),
            description: "View past LTC Applications"
        },
        {
            image: require('./HowToPics/Client/pick_ltc.png'),
            description: "Pick an LTC Application to start TA form"
        },
        {
            image: require('./HowToPics/Client/ta-form.png'),
            description: "Fill TA form"
        },
        {
            image: require('./HowToPics/Client/past-ta.png'),
            description: "View Past TA applications"
        },
    ]

    return (
        <Box margin={"0vh 0 0 6vh"} minHeight="calc(100vh - 80px)">
            <Carousel
                autoPlay={false}
                NavButton={({onClick, className, style, next, prev}) => {
                    return (
                        <Button onClick={onClick} className={className} style={style}>
                            {next && <NavigateNextIcon />}
                            {prev && <ArrowBackIosIcon />}
                        </Button>
                    )
                }}
            >
                {
                    client.map((item, i) => <Item key={i} item={item} />)
                }
            </Carousel>
        </Box>
    )
}

function Item(props) {
    return (
        <Paper style={{minHeight:"83vh", maxHeight:"83vh"}}>
            <center>
            <Box padding={"3vh 3vh 1vh 3vh"}>
            <h3>{props.item.description}</h3>
            <img src={props.item.image} style={{minHeight:"68vh", maxHeight:"68vh"}}></img>
            </Box>
            </center>
        </Paper>
    )
}

export default HowTo