import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { auth } from '../../util/api';
import { groups } from '../../util/api';
// Components
import Index from '../Index/Index'; // isso precisa morrer
import Navbar from '../Navbar/Navbar';

import Login from '../Login/Login';
import Signup from '../Signup/Signup';

import Dashboard from '../Dashboard/Dashboard';

import Pessoas from '../DashPessoas/DashPessoas';
import Despesas from '../DashDespesas/DashDespesas';
import Acertos from '../DashAcertos/DashAcertos';
import DeleteModal from '../Modal/DeleteModal';
import EditModal from '../Modal/EditModal';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import Reports from '../Reports/Reports';

// fake data
const fakeExpense01 = {
  _id: 21,
  group: '000',
  description: 'ABC EXPENSE',
  value: 1000,
  split: {
    paidBy: 'FULANO',
    divideBy: ['CICLANO-01', 'CICLANO-02'],
  },
};
const fakeExpense02 = {
  _id: 25,
  group: '000',
  description: 'ABC EXPENSE 0002',
  value: 1000,
  split: {
    paidBy: 'FULANO 02',
    divideBy: ['CICLANO-01', 'CICLANO-02'],
  },
};
const fakeMembers = ['Fulano', 'Ciclano', 'Barbosa'];
const fakeSettle01 = {
  _id: 31,
  group: 'GROUP ID',
  value: 200,
  paidBy: fakeMembers[0],
  paidTo: fakeMembers[1],
};
const fakeSettle02 = {
  _id: 32,
  group: 'GROUP ID',
  value: 300,
  paidBy: fakeMembers[1],
  paidTo: fakeMembers[2],
};
const fakeGroups = [
  {
    _id: '5e3ca62f1572e558f09a9fd8',
    groupName: 'GRUPO 001',
    description: 'bla bla bla grupo',
    owner: 200,
    members: fakeMembers,
    expense: [fakeExpense01, fakeExpense02],
    settles: [fakeSettle01, fakeSettle02],
  },
  {
    _id: '12',
    groupName: 'GRUPO 002',
    description: 'lalala',
    owner: 200,
    members: fakeMembers, //STRING
    expense: [fakeExpense02, fakeExpense01],
    settles: [fakeSettle02, fakeSettle01],
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuth: false,
      groups: [],
      selectedGroup: fakeGroups[0],
    };
    // this.addMember = this.addMember.bind(this); ===> PRECISA???
    // this.addExpense = this.addExpense.bind(this);
    // this.addSettle = this.addSettle.bind(this);
    this.renderModalDelete = this.renderModalDelete.bind(this); //TODOS OS DELETES ESTAO AQUI
    this.getUser = this.getUser.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.getSelectedGroup = this.getSelectedGroup.bind(this);
    this.getGroups = this.getGroups.bind(this);
  }

  componentDidUpdate() {
    this.fetchGroups();
  }

  componentDidMount() {
    this.fetchGroups();
  }

  async fetchUser() {
    if (this.state.isAuth === false) {
      try {
        const loggedInUser = await auth.isAuth();
        this.setState({
          user: loggedInUser,
          isAuth: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  getUser(userObj) {
    if (userObj === null) {
      this.setState({
        user: null,
        isAuth: false,
      });
    } else {
      this.setState({
        user: userObj,
        isAuth: true,
      });
    }
  }

  getSelectedGroup(groupObj) {
    if (groupObj === null) {
      this.setState({
        selectedGroup: null,
      });
    } else {
      this.setState({
        selectedGroup: groupObj,
      });
    }
  }

  async fetchGroups() {
    if (this.state.groups.length === 0)
      try {
        const response = await groups.getAll();
        const { status, data } = response;
        console.log('data para os grupos:', data);
        if (status !== 200) {
          console.log('Erro api', data);
        } else {
          this.setState({
            groups: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
  }

  getGroups(groups) {
    if (groups === null) {
      this.setState({
        groups: [],
      });
    } else {
      this.setState({
        groups,
      });
    }
  }

  createGroup(newGroup) {
    this.state.groups.push(newGroup);
  }

  deleteOneElement = (elementID) => {
    //TODO deletar por ID ou ... name se for o caso do members
    // const index = this.state.selectedGroup.members.indexOf(memberID);
    // if (index > -1) {
    //   this.state.selectedGroup.members.splice(index, 1);
    // } return message = "Can not find ID Member";
  };
  renderModalEdit = (element, thisPage) => (
    <EditModal
      element={element}
      iAmInThisPage={thisPage}
      editGroup={
        (this.editGroup = (idOfGroupToEdit, newInfo) => {
          groups.put(idOfGroupToEdit, newInfo);
          console.log('ESSE É O ID DO GRUPO PARA EDITAR', idOfGroupToEdit);
          console.log('ESSA SAO AS INFORMAÇÕES DO GRUPO PARA EDITAR', newInfo);
        })
      }
    />
  );
  renderModalDelete = (midleText, element, thisPage) => (
    <DeleteModal
      midleText={midleText}
      element={element}
      iAmInThisPage={thisPage}
      removeGroup={
        (this.removeGroup = (idOfGroupToRemove) => {
          console.log('ESSE É O ID DO GRUPO PARA REMOVER', idOfGroupToRemove);
        })
      }
      removeMember={
        (this.removeMember = (memberToRemove) => {
          console.log('ESSE É O MEMBRO PARA REMOVER', memberToRemove);

          //   const groupCopy = { ...this.state.selectedGroup }; -----------APAGAR
          //   let idx = groupCopy.members.indexOf(memberToRemove);
          //   groupCopy.members.splice(idx, 1);
          //   this.setState({
          //     selectedGroup: groupCopy,
          //   });
        })
      }
      removeExpense={
        (this.removeExpense = (expenseInfo) => {
          const {_id, group, description, value, split } = expenseInfo;
          groups.deleteExpense(group, _id);
        })
      }
      removeSettle={
        (this.removeSettle = (settleToRemove) => {
          const {_id, group, value, paidBy, paidTo} = settleToRemove;
          groups.deleteSettle(group, _id)
        })
      }
    />
  );

  addGroup = (newGroup) => {
    console.log('ESSAS SÃO AS INFORMAÇÕES DO NOVO GRUPO', newGroup);
    // const groupCopy = { ...this.state.selectedGroup };
    // groupCopy.Groups.push(newGroup);

    // this.setState({
    //   selectedGroup: groupCopy,
    // });
  };

  addMember = (newMember) => {
    groups.addMember(newMember);
  };

  addExpense = (newExpense) => {
    const {group, description, value, split } = newExpense;
    groups.createExpense(group, {description, value, split})
  };

  editExpense = (idOfExpenseToEdit, newInfo) => {
    const {group, description, value, split } = newInfo;
    groups.putExpense(group, idOfExpenseToEdit, {description, value, split})
  };

  editSettle = (idOfSettleToEdit, newInfo) => {
    const { group, value, paidBy, paidTo } = newInfo;
    groups.putSettle(group, idOfSettleToEdit, {value,paidBy,paidTo});
  };

  addSettle = (newSettle) => {
    const { group, value, paidBy, paidTo} = newSettle;
    groups.createSettle(group, {value, paidBy, paidTo});
  };

  render() {
    this.fetchUser();
    return (
      <div className="App">
        <Navbar
          userInSession={this.state.user}
          getUser={this.getUser}
          authed={this.state.isAuth}
          groups={this.state.groups}
          addGroup={this.addGroup}
        />
        {this.state.isAuth ? (
          <Switch>
            <Route
              exact
              path="/reports"
              render={(props) => {
                return <Reports data={this.state} {...props} />;
              }}
            />
            <Route
              exact
              path="/login"
              render={(props) => {
                return (
                  <Login
                    getUser={this.getUser}
                    getGroups={this.getGroups}
                    {...props}
                  />
                );
              }}
            />
            <Route
              exact
              path="/signup"
              render={(props) => {
                return <Signup getUser={this.getUser} {...props} />;
              }}
            />
            <Route
              exact
              path="/"
              render={() => <Index getUser={this.getUser} />}
            />
            <Route
              exact
              path="/groups"
              render={(props) => {
                return (
                  <Dashboard
                    data={this.state}
                    {...props}
                    renderModalDelete={this.renderModalDelete}
                    renderModalEdit={this.renderModalEdit}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/pessoas"
              render={(props) => {
                return (
                  <Pessoas
                    {...props}
                    oneGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    renderModalEdit={this.renderModalEdit}
                    addMember={this.addMember}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/despesas"
              render={(props) => {
                return (
                  <Despesas
                    {...props}
                    oneGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    editExpense={this.editExpense}
                    addExpense={this.addExpense}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/acertos"
              render={(props) => {
                return (
                  <Acertos
                    {...props}
                    oneGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    addSettle={this.addSettle}
                    editSettle={this.editSettle}
                  />
                );
              }}
            />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/login"
              user={this.state.user}
              render={(props) => (
                <Login
                  getUser={this.getUser}
                  getGroups={this.getGroups}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              user={this.state.user}
              render={(props) => <Signup getUser={this.getUser} {...props} />}
            />
            <Route
              exact
              path="/"
              user={this.state.user}
              render={(props) => <Index getUser={this.getUser} {...props} />}
            />
            <Route
              exact
              path="/reports"
              render={(props) => {
                return <Reports data={this.state} {...props} />;
              }}
            />
            <PrivateRoute
              exact
              path="/dashboard"
              authed={this.state.isAuth}
              component={Dashboard}
              data={this.state}
            />

            <PrivateRoute
              exact
              path="/groups"
              authed={this.state.isAuth}
              component={Dashboard}
              data={this.state}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default App;
