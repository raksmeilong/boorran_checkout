/* eslint-disable no-unused-vars */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, ButtonBase, Box, Tab } from '@mui/material'
import Tabs, { tabsClasses } from '@mui/material/Tabs'

const styles = {
  container: {
    mb: 1,
    mt: -0.8,
    bgcolor: 'background.paper',
  },
  categoryWrapper: {
    display: 'flex',
    bgcolor: 'white',
    overflowX: 'scroll',
    flexDirection: 'row',
    [`& .${tabsClasses.scrollButtons}`]: {
      '&.Mui-disabled': { opacity: 0.3 },
    },
  },
  category: {
    fontSize: 13,
    width: '100%',
    color: 'lightgray',
  },
  button: {
    mx: 1,
    my: 1,
    py: 0.5,
    px: 1,
    borderRadius: 0,
    boxShadow: '7px 7px 0px 0 #616161',
    border: '1px solid #e0e0e0',
  },
}

const Venders = ({productVenders}) => {
  const navigate = useNavigate()
  // const venders = productVenders?.edges.map((edge) => edge.node)
  // {data?.order.fulfillmentOrders.edges.map((edge) => edge.node.id)}

// console.log(venders)
  return (
    <Box sx={styles.container}>
      <Tabs variant="scrollable" scrollButtons sx={styles.categoryWrapper}>
        {productVenders?.edges.map((venders)  =>{
          // const isActiveCategory = category.value === activeCategory.value

          return (
            <Tab
              sx={[styles.button]}
              key={venders.node}
              onClick={() => navigate(`/collections/${venders.node}`)}
              label={venders.node}
            />
          )
        })}  
      </Tabs>
    </Box>
  )
}

export default Venders
