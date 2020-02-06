import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {groups} from '../../util/api'       // Groups component from API service 

class ReportsSettle extends Component {
    constructor(props){
        super(props);
        this.state = {msg:'', balances: []};

    }

    componentDidMount() {
        groups.getBalance(this.props.groupId) //props do Id do grupo; 
        .then(qryObj => {
            console.log('componentDidMount',qryObj);
            this.setState({msg: qryObj.data.msg, balances:qryObj.data.queryResult}, () => console.log(this.state) )

        })
        .catch(error => console.log('erro ReportSummary', error))

    }


    render(){
                
        if (this.state.balances) {//Conditional return 
            return(
            <div>
         
                <p>
                    Pagamentos a serem realizados:
                </p>
                
                <div className="resultTable table-responsive-md">
                    <table className="table table3 table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Integrante</th>
                                <th scope="col">Deve</th>
                                <th scope="col">Para</th>
                            </tr>
                        </thead>
                        <tbody>
            
                            {/* Map que recebe os registros da API e cria uma row de tabela - vide exemplo abaixo */}
                            {this.state.balances.map((qry, idx) => {
                                return (
                                    <tr key={idx} >    
                                        <td>{qry.member}</td>
                                        <td>{qry.expensePaid}</td>
                                        <td>{qry.share}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <br/>
                <hr/>
                <br/>
            
               
            </div>
            )
        } else { //Conditional return FALSE
            return(
                <div>
                    <h1>Carregando...</h1>
                </div>
            )
        }
    }
}

export default ReportsSettle