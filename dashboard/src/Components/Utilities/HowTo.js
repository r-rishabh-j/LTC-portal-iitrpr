import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Box } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const HowTo = ({ permission }) => {
    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!"
        },
        {
            name: "Random Name #2",
            description: "Hello World!"
        }
    ]

    return (
        <Box margin={"2vh 0 0 6vh"} minHeight="calc(100vh - 95px)">
            <Carousel
                // NextIcon={<NavigateNextIcon />}
                // PrevIcon={<ArrowBackIosIcon />}
                autoPlay={false}
                NavButton={({onClick, className, style, next, prev}) => {
                    // Other logic
            
                    return (
                        <Button onClick={onClick} className={className} style={style}>
                            {next && <NavigateNextIcon />}
                            {prev && <ArrowBackIosIcon />}
                        </Button>
                    )
                }}
            >
                {
                    items.map((item, i) => <Item key={i} item={item} />)
                }
            </Carousel>
        </Box>
    )
}

function Item(props) {
    return (
        <Paper>
            <Box padding={"5vh 3vh 3vh 3vh"}>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>
            </Box>
        </Paper>
    )
}

export default HowTo