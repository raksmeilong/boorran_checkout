import { Payment } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Box } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import moment from "moment";

const Track = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 9 }}>
      <div>
        {/* <Button onClick={() => getLocations()}>Search</Button> */}

        <Autocomplete
          disabled
          size="small"
          //   options={data?.boorran_Orders || []}
          getOptionLabel={(option) => [
            option.shopifyOrderNumber,
            option.customer.firstName,
            option.customer.phone,
          ]}
          //   loading={loading}
          freeSolo
          forcePopupIcon={false}
          // renderInput={(params) => (
          //   <TextField
          //     fullWidth
          //     {...params}
          //       value={filters}
          //     label="Please put your phone number ..."
          //       onKeyDown={(e) => {
          //         if (e.key === "Enter") {
          //           setFilters(e.target.value);
          //           getLocations();
          //         }
          //       }}
          //   />
          // )}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{
                margin: "auto",
                flexGrow: 1,
                boxShadow: 1,
                borderRadius: 1,
              }}
              {...props}
            >
              {option && (
                <Grid
                  wrap="nowrap"
                  component={RouterLink}
                  to={`/orders/${option.id}`}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={(0, 2)}
                >
                  <Grid item xs={2}>
                    <ListItemText
                      primary={option.shopifyOrderNumber}
                      secondary={moment(option.createdAt).format(
                        "Do MM YYYY, h:mm a"
                      )}
                    />
                  </Grid>
                  <Divider orientation="vertical" flexItem />
                  <Grid item xs={1.5}>
                    <ListItemText primary="Status" />
                    <Payment status={option.status} />
                  </Grid>
                  <Divider orientation="vertical" flexItem />

                  <Grid item xs={1.5}>
                    <ListItemText primary="Delivery" />
                    {/* <Fulfilment status={option.deliveryStatus} /> */}
                  </Grid>
                  <Divider orientation="vertical" flexItem />

                  <Grid item xs={6}>
                    <ListItemText
                      primary={option.customer.firstName}
                      secondary={option.orderAddress}
                    />
                    <ListItemText secondary={option.customer.phone} />
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        />
        {/* <input value={name} onChange={(e) => setName(e.target.value)} /> */}
        {/* {loading && <div>loading...</div>}
      {error && <div>error</div>} */}

        {/* {nodes && (
        <ul>
          {nodes.map((i) => {
            return (
              <li>
                <Link to={`/orders/${i.id}`}>{i.name}</Link>
              </li>
            )
          })}
        </ul>
      )} */}
      </div>
    </Container>
  );
};

export default Track
