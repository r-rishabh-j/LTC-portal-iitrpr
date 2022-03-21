import React from 'react'
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { Typography } from '@material-ui/core';

const LoadingPage = () => {
  return (
    <div>
      <Typography variant="h5">
        <HourglassEmptyIcon />
         Loading...
      </Typography>
    </div>
  );
}

export default LoadingPage