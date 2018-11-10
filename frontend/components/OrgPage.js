import React, { Component } from "react";
import CreateOrg from "./CreateOrg";
import OrgList from "./OrgList";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Input, FormControl, InputLabel } from "@material-ui/core";

export default class OrgPage extends Component {
  state = {
    OrgList: [],
    filteredOrgs: [],
    search: "",
    ranked: false,
    loading: true
  };
  getOrgList = () => {
    this.setState({ loading: true });
    axios
      .get(`http://127.0.0.1:5000/orgs/${this.state.ranked ? "ranked" : ""}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            OrgList: res.data.orgs,
            filteredOrgs: res.data.orgs,
            loading: false
          });
        } else {
          alert(res.data.msg);
        }
      })
      .catch(err => console.log(err));
  };
  componentDidMount() {
    this.getOrgList();
  }
  handleKeyUp = e => {
    this.setState({ search: e.target.value }, () => {
      let filtered = this.state.OrgList.filter(org =>
        org.name.toLowerCase().includes(this.state.search.toLowerCase())
      );
      this.setState({ filteredOrgs: filtered });
    });
  };

  toggleRanked = () => {
    this.setState({ ranked: !this.state.ranked }, () => {
      this.getOrgList();
    });
  };

  render() {
    let list;
    if (this.state.loading) {
      list = (
        <CircularProgress
          size={200}
          style={{ marginLeft: "400px", marginTop: "100px" }}
        />
      );
    } else {
      list = this.state.filteredOrgs.map(org => {
        return (
          <OrgList
            key={org._id + Math.random() * 100}
            id={org._id}
            name={org.name}
            description={org.description}
            orgObject={org}
          />
        );
      });
    }

    return (
      <div>
        <FormControl margin="normal" fullWidth>
          <InputLabel>
            <SearchIcon />
          </InputLabel>
          <Input
            placeholder="Purdue Hackers"
            onKeyUp={this.handleKeyUp}
          />
        </FormControl>
        <Button
          style={{ backgroundColor: "#60b0f4" }}
          type="submit"
          multiple
          color="primary"
          onClick={this.toggleRanked}
        >
          Rank
        </Button>
        <CreateOrg getOrgList={this.getOrgList} />
        {list}
      </div>
    );
  }
}
