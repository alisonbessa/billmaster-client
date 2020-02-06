import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

class DashNavbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      ID: this.props.ID,
      groupName: this.props.groupName,
      description: this.props.description
    }
  }
  render(){
    return(

      <>
    <h1>Grupo: {this.props.groupName}
    <h5>{this.props.description}</h5>
    </h1>
      
        <div className="dashContent row py-0 my-2">
          <div
            className="btn-group btn-group-toggle mx-auto my-0"
            data-toggle="buttons"
          >
            <NavLink
              to="/groups/pessoas"
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashPessoas" />
              Pessoas
            </NavLink>
  
            <NavLink
              to="/groups/despesas"
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashDespesas" />
              Despesas
            </NavLink>
  
            <NavLink
              to="/groups/acertos"
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashAcertos" />
              Acertos
            </NavLink>
          </div>
        </div>
        <hr className="my-2" />
      </>
    );
  };
}

export default DashNavbar;
