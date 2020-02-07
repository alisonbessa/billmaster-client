import React, { Component } from 'react';
import DashNavbar from '../DashNavbar/DashNavbar';
import CheckBox from './Checkbox';
import './DashDespesas.css';

const membersToArr = (arr) => {
  return arr.map((e) => {
    let memberObj = { name: e };
    return memberObj;
  });
};

class DashDespesas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.oneGroup,
      members: membersToArr(this.props.oneGroup.members),
      expense: this.props.oneGroup.expense,
      selectedMembers: [],
      newExpense: {
        group: this.props.oneGroup._id,
        description: '',
        value: 0,
        split: {
          paidBy: '',
          divideBy: [],
          isDivideByAll: false,
        },
      },
    };
    this.editExpense = this.editExpense.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
  //   this.getSingleGroup();
  // }

  // async getSingleGroup() {
  //   const { params } = this.props.match;
  //   const group = await groups.getOne(params.id);

  //   console.log('group:', group)
  //   this.setState({
  //     group: group.data,
  //   });
  // }

  handleAllChecked = (event) => {
    const newExpense = { ...this.state.newExpense };
    let isDivideByAll = 'Error';
    event.target.checked ? (isDivideByAll = true) : (isDivideByAll = false);
    newExpense.split.isDivideByAll = isDivideByAll;

    newExpense.split.divideBy = [];

    let members = [...this.state.members];
    members.map((e) =>
      event.target.checked
        ? newExpense.split.divideBy.push(e.name)
        : newExpense.split.divideBy
    );
    members.forEach((member) => (member.isChecked = event.target.checked));
    this.setState({ newExpense: newExpense }, () =>
      console.log('TESTE', this.state.newExpense.split.divideBy)
    );
  };
  editExpense = (e) => {
    let { newExpense } = this.state;
    newExpense = e;

    this.setState({ newExpense: newExpense });
  };
  handleCheckChieldElement = (event) => {
    const { newExpense } = this.state;
    let members = [...this.state.members];

    let selectedMembers = [...this.state.selectedMembers];

    members.map((member) => {
      if (member.name === event.target.value) {
        member.isChecked = event.target.checked;

        if (!event.target.checked) {
          document.getElementById('isDivideByAll').checked = false;
          newExpense.split.isDivideByAll = false;
          let idx = selectedMembers.indexOf(member.name);
          selectedMembers.splice(idx, 1);
        } else if (event.target.checked) {
          document.getElementById('isDivideByAll').checked = true;
          let it = 0;
          members.map((e) => {
            !e.isChecked
              ? (document.getElementById('isDivideByAll').checked = false)
              : (it = 1);
          });
          selectedMembers.push(member.name);
        }
      }
      newExpense.split.isDivideByAll = document.getElementById(
        'isDivideByAll'
      ).checked;
    });
    this.setState({
      members: members,
      selectedMembers: selectedMembers,
      newExpense: newExpense,
    });
  };
  handleChange = (event) => {
    const newExpense = { ...this.state.newExpense };
    const { name, value } = event.target;

    switch (name) {
      case 'paidBy':
        newExpense.split.paidBy = value;
        break;
      case 'divideBy':
        newExpense.split.divideBy = value;
        break;
      case 'value':
        newExpense.value = value;
        break;
      case 'description':
        newExpense.description = value;
        break;
      default:
        break;
    }
    this.setState({ newExpense: newExpense });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { newExpense } = this.state;
    newExpense.split.divideBy = this.state.selectedMembers;

    // If has an id got to edit function and else add new one expense
    newExpense._id
      ? this.props.editExpense(newExpense._id, newExpense)
      : this.props.addExpense(newExpense);

    this.setState({ newExpense: newExpense });
  };

  render() {
    const { id: paramId } = this.props.match.params;
    return (
      <>
        <DashNavbar
          paramId={paramId}
          description={this.state.group.description}
          groupName={this.state.group.groupName}
        />

        <div className="dashMainContent mx-2 p-0">
          {/* <!-- Add bills --> */}
          <h2>Adicionar nova despesa:</h2>
          <form
            onSubmit={this.handleSubmit}
            className="dashAddBills d-flex justify-content-between align-items-end flex-wrap"
          >
            <div className="form-group text-left col-xl-3 m-1 mb-0 p-0">
              Descrição:
              <input
                type="text"
                className="form-control"
                maxLength="25"
                name="description"
                onChange={this.handleChange}
                value={this.state.newExpense.description}
              />
            </div>
            <div className="form-group text-left col-xl-2 m-1 mb-0 p-0">
              Pagou:
              <select
                className="form-control"
                name="paidBy"
                onChange={this.handleChange}
              >
                <option>Selecione um membro</option>
                {[...this.state.members]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((member) => {
                    return <option>{member.name}</option>;
                  })}
              </select>
            </div>
            <div className="form-group text-left col-xl-2 mb-0 m-1 p-0">
              Valor:
              <input
                type="number"
                className="form-control"
                min="0.00"
                max="10000.00"
                step="0.01"
                id="value"
                placeholder="R$ 10,00"
                onChange={this.handleChange}
                name="value"
              />
            </div>

            <div className="form-group text-left col-xl-2 mb-0 m-1 p-0">
              Dividir Por:
              <div className="btn btn-outline-secondary dropdown dropdown-toggle form-control">
                Selecione os membros
                <div className="dropdown-content form-group">
                  <div className="dropdown-item d-flex form-group">
                    <input
                      className="dropdown-item mx-0 my-auto bg-transparent"
                      type="checkbox"
                      onChange={this.handleChange}
                      onClick={this.handleAllChecked}
                      id="isDivideByAll"
                      name="isDivideByAll"
                    />
                    <label
                      className="dropdown-item py-2 my-0 bg-transparent"
                      htmlFor="isDivideByAll"
                    >
                      Todos
                    </label>
                  </div>
                  <ul>
                    {[...this.state.members].map((member) => {
                      return (
                        <CheckBox
                          handleCheckChieldElement={
                            this.handleCheckChieldElement
                          }
                          handleChange={this.handleChange}
                          doSomething={this.doSomething}
                          {...member}
                        />
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-warning mb-1 col-xl-1">
              Submit
            </button>
          </form>
          <hr />

          {/* <!-- Bills list --> */}
          <div className="dashBillsList m-1">
            <div className="row m-0">
              {[...this.state.expense].map((e) => {
                return (
                  <div className="col-lg-5 p-0 m-1 mx-auto dashComponents">
                    <div className="col-9 p-0">
                      <button className="btn btn-outline-secondary boxComponent">
                        {e.description}
                      </button>
                    </div>
                    <div className="col-2 p-0">
                      <button
                        className="btn btn-warning buttonOptions"
                        type="button"
                        onClick={() => this.editExpense(e)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger buttonOptions"
                        type="button"
                        data-toggle="modal"
                        data-target={`#deleteButton${e._id}`}
                      >
                        Excluir
                      </button>
                    </div>
                    {this.props.renderModalDelete(
                      e.description,
                      e._id,
                      'expense'
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DashDespesas;
