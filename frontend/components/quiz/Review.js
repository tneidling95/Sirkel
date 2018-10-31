import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing.unit * 2
  }
});

function Review(props) {
  let handleSubmit = e => {
    axios
      .post("http://127.0.0.1:5000/users/survey", {
        basicInfo: props.data.basicInfo,
        shortQuestions: props.data.shortQuestions
      })
      .then(res => {
        if (res.data.success) {
          props.handleNext();
        }
      });
  };
  let products = [
    { name: "Name", answer: props.data.basicInfo.name },
    { name: "Age", answer: props.data.basicInfo.age },
    {
      name: "Do you like sports? (Y/N)",
      answer: props.data.shortQuestions.q1
    },
    {
      name: "Do you like listening to music? (Y/N)",
      answer: props.data.shortQuestions.q2
    },
    {
      name: "Do you like playing video games? (Y/N)",
      answer: props.data.shortQuestions.q3
    }
  ];
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Survey summary
      </Typography>

      <List disablePadding>
        {products.map(product => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} />
            <Typography variant="body2">{product.answer}</Typography>
          </ListItem>
        ))}
      </List>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        style={{
          marginTop: "30px",
          marginLeft: "450px"
        }}
      >
        Submit
      </Button>
    </React.Fragment>
  );
}

Review.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Review);
