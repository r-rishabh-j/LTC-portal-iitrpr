import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LTCApplications from './LTCApplications';
import TAApplications from './TAApplications';
import Users from './Users';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        <Box p={3}>{value === index && children}</Box>
      </Typography>
    );
  }

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',margin: "0 0 0 3vw" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab label="LTC Applications" {...a11yProps(0)} />
          <Tab label="TA Applications" {...a11yProps(1)} />
          <Tab label="Users" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} >
        <LTCApplications></LTCApplications>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TAApplications></TAApplications>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Users/>
      </TabPanel>
    </Box>
  );
}
