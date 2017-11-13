import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'
import './WaitingGame.css';
import PlayersScorePanelTop from '../../../PlayerScores/Components/PlayersScorePanelTop/PlayersScorePanelTop';
import GameScores from '../../../PlayerScores/Components/GameScores/GameScores';
import {baseUrl} from '../../../config';

class WaitingGame extends Component {
  state = { userScores: [0,0,0,0,0,0], opponentScores: [0,0,0,0,0,0] };

  componentDidMount(){
    setTimeout(()=>{
        console.log("join dummy user");
        this.joinDummyUser(this.props.gameId);
    }, 30000);
  }

  joinDummyUser = (gameId) => {
      fetch(baseUrl+'/api/quizGames/'+gameId+'/join', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: 'user-55PPmJHerU'
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {})
      .catch((error) => {});
  }

  render() {
    const { userScores,opponentScores } = this.state;
    
    return (
        <div>
            <PlayersScorePanelTop userScores={userScores} opponentScores={userScores}></PlayersScorePanelTop>
            <GameScores currentIndex={-1} userScores={userScores} opponentScores={userScores}></GameScores>
            <Header as='h1' textAlign='center'>Waiting for other player to join this game</Header>
        </div>
    );
  }
}

export default WaitingGame;
