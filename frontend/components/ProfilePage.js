import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import serverAddress from "../utils/serverAddress";

const styles = theme => ({
  root: {
    width: "100%"
  },

  paper: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class ProfilePage extends Component {
  state = {
    user: { orgsAdmin: [], connections: [] },
    events: [],
  };
  componentDidMount() {
    this.getProfileData();
  }
  async getProfileData() {
    const token = localStorage.getItem("jwtToken");
    setAuthToken(token);
    const profileRes = await axios.get(`${serverAddress}/users/profile`);
    this.setState({
      user: profileRes.data.user,
    });
    this.getEventData();
  }
  async getEventData() {
    const eventRes = await axios.get(`${serverAddress}/events`);
    let posterEvents = eventRes.data.events.filter(e => {
      return e.poster.id == this.state.user._id;
    });
    this.setState({ events: posterEvents });
  }
  deleteEvent = id => {
    axios.delete(`${serverAddress}/events/${id}`).then(res => {
      if (res.data.success) {
        this.getEventData();
      }
    });
  };
  handleMessage = id => {
    let receivers = [this.state.user._id, id];
    axios
      .post(`${serverAddress}/chats/create`, {
        receivers
      })
      .then(res => {
        if (res.data.success) {
          this.props.history.push(`/chats/${res.data.id}`);
        }
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>My username</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{this.state.user.username}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>My email</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{this.state.user.email}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Take a survey</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Link to="/survey">Click here</Link>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>My Organzations</Typography>
          </ExpansionPanelSummary>

          {this.state.user.orgsAdmin.map(org => {
            return (
              <Paper key={Math.random() * 100} className={classes.paper}>
                <h3>{org.orgname}</h3>
                <Button
                  className="navButton"
                  style={{ backgroundColor: "#60b0f4", color: "white" }}
                >
                  <Link to={`/org/${org.id}`}> Visit Page </Link>
                </Button>
              </Paper>
            );
          })}
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>My events</Typography>
          </ExpansionPanelSummary>

          {this.state.events.map(e => {
            return (
              <Paper key={Math.random() * 100} className={classes.paper}>
                <h3>{e.name.toUpperCase()}</h3>
                <Button
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => this.deleteEvent(e._id)}
                >
                  Cancel
                </Button>
              </Paper>
            );
          })}
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>My connections</Typography>
          </ExpansionPanelSummary>
          {this.state.user.connections.map(user => {
            return (
              <Paper key={Math.random() * 100} className={classes.paper}>
                  <Typography>{user.username}</Typography>
                  <button onClick={() => this.handleMessage(user.id)} 
                    className="navButton"
                    style={{ backgroundColor: "#60b0f4", color: "white" }}
                  >
                    Message
                  </button>
              </Paper>
            );
          })}
        </ExpansionPanel>
        <Button
          fullWidth
          onClick={() =>{
            if(!this.state) return;
            axios
            .post(`${serverAddress}/users/generate/change`, {
              username: this.state.user.username,
            })
            .then(res => {
              if (res.data.success) {
                this.props.history.push("/users/reset/"+res.data.link);
              }
            })
            .catch(err => console.log(err));
          }}
          style={{
          backgroundColor: "#fff",
          color: "#60b0f4"
          }}
        >
          Change Password
        </Button>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePage);
