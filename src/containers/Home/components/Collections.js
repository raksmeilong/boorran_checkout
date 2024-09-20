/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Tab } from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";

import findIndex from 'lodash/findIndex'

const styles = {
  container: {
    mb: 1,
    mt: -0.8,
    bgcolor: "background.paper",
  },
  categoryWrapper: {
    display: "flex",
    bgcolor: "white",
    overflowX: "scroll",
    flexDirection: "row",
    [`& .${tabsClasses.scrollButtons}`]: {
      "&.Mui-disabled": { opacity: 0.3 },
    },
  },
  category: {
    fontSize: 13,
    width: "100%",
    color: "lightgray",
  },
  button: {
    mx: 1,
    my: 1,
    py: 0.5,
    px: 1,
    borderRadius: 0,
    boxShadow: "7px 7px 0px 0 #616161",
    border: "1px solid #e0e0e0",
  },
};

const Collections = ({ data, activeCollection }) => {
  const navigate = useNavigate();
  const activeCollectionIndex = findIndex(data, collection => collection.handle === activeCollection)

  return (
    <Box sx={styles.container}>
      <Tabs
        variant="scrollable"
        sx={styles.categoryWrapper}
        value={activeCollectionIndex !== - 1 ? activeCollectionIndex : false}
      >
        {data ? data.map((collection, index) => {
          const isActive = collection.title === activeCollection;

          return (
            <Tab
              key={index}
              label={collection.title}
              sx={[styles.button, isActive && { color: "black" }]}
              onClick={() => {
                const urlPath = collection === "All"
                  ? `/collections`
                  : `/collections/${collection.handle}`

                navigate(urlPath)
              }}
            />
          );
        }) : null}
      </Tabs>
    </Box>
  );
};

export default Collections;
