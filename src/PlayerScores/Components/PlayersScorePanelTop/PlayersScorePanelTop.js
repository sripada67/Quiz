import React, { Component } from 'react';
import { Container, Header, Grid, Image, Button } from 'semantic-ui-react'
import './PlayersScorePanelTop.css';
import player1 from './player1.jpg';
import player2 from './player2.png';

class PlayersScorePanelTop extends Component {
  state = { userScores: this.props.userScores, opponentScores: this.props.opponentScores, utotal: 0, ototal: 0,uwrongAnswers:[],owrongAnswers:[] };


  componentWillReceiveProps(nextProps){
    let uscores,oscores,utotal = 0,ototal = 0,uwrongAnswers,owrongAnswers;

    uscores = nextProps.userScores.filter(function (a) { return a >= 0; });
    if(uscores.length>0)
      utotal = uscores.reduce(function (a, b) { return a + b; });

    uwrongAnswers = nextProps.userScores.filter(function (a) { return a < 0; });

    oscores = nextProps.opponentScores.filter(function (a) { return a >= 0; });
    if(oscores.length>0)
      ototal = oscores.reduce(function (a, b) { return a + b; });
    owrongAnswers = nextProps.opponentScores.filter(function (a) { return a < 0; });
    this.setState({ utotal: utotal, ototal:ototal,uwrongAnswers:uwrongAnswers,owrongAnswers:owrongAnswers });
  }

  getSum(total, num){
    if(num>=0){
      return total + num;
    }else{
      return total;
    }
  }
  
  render() {
    return (
      <div className="quizheader">
        <Container>
            <Grid columns={3} divided>
              <Grid.Row>
                <Grid.Column textAlign='right' mobile='3'>
                  <Header as='h2'>
                    <Image shape='circular' src={player1} verticalAlign='middle' />
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center' verticalAlign='middle' mobile='10'>
                  <Button.Group  size='medium'>
                    <Button primary>{this.state.utotal}-{this.state.uwrongAnswers.length}</Button>
                    <Button.Or />
                    <Button positive>{this.state.ototal}-{this.state.owrongAnswers.length}</Button>
                  </Button.Group>
                </Grid.Column>
                <Grid.Column textAlign='left' mobile='3'>
                  <Header as='h2'>
                    <Image shape='circular' src={player2} verticalAlign='middle' />
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
        </Container>
      </div>
    );
  }
}

export default PlayersScorePanelTop;
