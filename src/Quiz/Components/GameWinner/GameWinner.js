import React, { Component } from 'react';
import { Container, Card } from 'semantic-ui-react'
import './GameWinner.css';
import winner from './win.jpg';
import loser from './loss.jpg';
import tie from './tie.jpg';

class GameWinner extends Component {
  state = { userScores: this.props.userScores, opponentScores: this.props.opponentScores, utotal: 0, ototal: 0,uwrongAnswers:[],owrongAnswers:[],result:null };

  componentDidMount(){
    let uscores,oscores,utotal = 0,ototal = 0,uwrongAnswers,owrongAnswers,result;

    uscores = this.state.userScores.filter(function (a) { return a >= 0; });
    if(uscores.length>0)
      utotal = uscores.reduce(function (a, b) { return a + b; });

    uwrongAnswers = this.state.userScores.filter(function (a) { return a < 0; });

    oscores = this.state.opponentScores.filter(function (a) { return a >= 0; });
    if(oscores.length>0)
      ototal = oscores.reduce(function (a, b) { return a + b; });
    owrongAnswers = this.state.opponentScores.filter(function (a) { return a < 0; });

    if(utotal===ototal){
        if(uwrongAnswers.length === owrongAnswers.length){
            result = 'tie';
        }else if(uwrongAnswers.length>owrongAnswers.length){
            result = 'loss';
        }else{
            result = 'win';
        }
    }else if(utotal>ototal){
        result = 'win';
    }else{
        result = 'loss';
    }
    this.setState({ utotal: utotal, ototal:ototal,uwrongAnswers:uwrongAnswers,owrongAnswers:owrongAnswers,result:result });
  }

  render() {
    const { result } = this.state;
    
    return (
        <Container>
            {
                (result === 'tie') ?
                    <Card centered={true} className="resultCard" image={tie} />
                : (result === 'loss') ?
                    <Card centered={true} className="resultCard" image={loser} />
                : (result === 'win') ?     
                    <Card centered={true} className="resultCard" image={winner} />
                :
                    ''                                  
            }

        </Container>
    );
  }
}

export default GameWinner;
