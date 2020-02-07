import React, { Component } from 'react';
import DashNavbar from '../DashNavbar/DashNavbar';
import { groups } from '../../util/api';

class DashPessoas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: null,
      newMember: ' ',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.props.addMember = this.props.addMember.bind(this);
  }
  handleChange(event) {
    const { value } = event.target;
    this.setState({ newMember: value });
    //teste
  }
  handleSubmit(event) {
    event.preventDefault();
    let str = this.state.newMember;
    str = str.replace(/\s{2,}/g, ' ');
    if (str === ' ') {
      return;
    }
    if (str[0] === ' ') {
      str.slice(0, 1);
      this.props.addMember(str);
    } else {
      this.props.addMember(str);
    }
    this.setState({
      newMember: ' ',
    });
  }

  render() {
    const { id: paramId } = this.props.match.params;
    let membersArray = [];
    if (Array.isArray(this.props.selectedGroup.members)) {
      membersArray = this.props.selectedGroup.members;
    }
    return (
      <>
        <DashNavbar paramId={paramId} />
        <div className="dashMainContent mx-4">
          <h2>Adicionar pessoa:</h2>
          <form
            onSubmit={this.handleSubmit}
            className="dashAddBills d-flex justify-content-between align-items-end flex-wrap"
          >
            <div className="form-group text-left col-lg-4 mt-1 mb-0 p-0">
              Nome:
              <input
                type="text"
                className="form-control"
                id="newMemberName"
                name="name"
                // value={this.state.newMember}
                onChange={this.handleChange}
                required
              />
            </div>
            {/* <div className="form-group text-left col-lg-5 mb-0 mt-1 p-0">
              Contato:
              <input
                type="text"
                className="form-control"
                id="newMemberContact"
                name="contact"
                value={this.state.newMember.contact}
                placeholder={"E-mail ou Telefone para contato"}
                onChange={this.handleChange}
              />
            </div> */}
            <button
              type="submit"
              value="submit"
              className="btn btn-warning mt-2 col-lg-2"
            >
              Submit
            </button>
          </form>
          <hr />

          <div className="dashBillsList">
            <div className="row">
              {membersArray
                .sort((a, b) => a.localeCompare(b))
                .map((e, i) => {
                  return (
                    <>
                      <div key={i} className="col-lg-6 p-0 my-1">
                        <button className="btn btn-outline-secondary col-10">
                          {e}
                        </button>{' '}
                        <button
                          className="btn btn-danger col-1"
                          onClick={() => this.props.renderModalDelete(e, e)}
                          type="button"
                          data-toggle="modal"
                          data="teste"
                          data-target={`#deleteButton${e}`}
                        >
                          {' '}
                          X{' '}
                        </button>
                        {this.props.renderModalDelete(e, e, 'member')}
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DashPessoas;
