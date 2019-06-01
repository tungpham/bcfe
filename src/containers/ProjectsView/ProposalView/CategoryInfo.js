import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NoteAdd as NoteAddIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    "& > div": {
      width: "100px",
      flexGrow: "0"
    }
  },
  subtitle: {
    fontSize: theme.typography.pxToRem(24),
    fontWeight: "bold"
  },
  type: {},
  value: {},
  desc: {}
}));

const CategoryInfoView = ({ edit, category, handleAdd }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div style={{ flexGrow: "1", padding: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.subtitle}>
              {category.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.type}>{category.type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.value}>{category.value}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.desc}>
              {category.description}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {edit && (
          <IconButton onClick={handleAdd}>
            <NoteAddIcon />
          </IconButton>
        )}

      </div>
    </div>
  );
};

CategoryInfoView.propTypes = {
  edit: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  handleAdd: PropTypes.func.isRequired
};

export default CategoryInfoView;
