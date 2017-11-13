import React, { Component } from 'react';
import './Quiz.css';
import PlayersScorePanelTop from './PlayerScores/Components/PlayersScorePanelTop/PlayersScorePanelTop';
import GameScores from './PlayerScores/Components/GameScores/GameScores';
import GameWinner from './Quiz/Components/GameWinner/GameWinner';
import WaitingGame from './Quiz/Components/WaitingGame/WaitingGame';
import { Container, Button, Card, Grid, Progress, Form, Input, Header } from 'semantic-ui-react'
import Question from './Quiz/Components/Question/Question';
import {baseUrl, socket} from './config';
import Sound from 'react-sound';
import Login from './Login';
import Timer from './Quiz/Components/Timer/Timer';
import Overlay from './Quiz/Components/Overlay/Overlay';

class Quiz extends Component {
  constructor() {
    super();
    this.state = { games:[],currentGame:{}, currentIndex: 0,uid:0,oid:0,question:{},userExists:false,scores:{}, joinedGame: false, inPlay: false,gameCompleted:false,gameId:null,opponentIndex:0,start:false,score:0,overlayVisible:false };
  }
  componentDidMount() {
    socket.emit('join room', 'quiz');
  }

  componentDidReceiveProps(nextProps){
    this.setState({ question: nextProps.question })
  }

  componentWillMount(){
    fetch(baseUrl+'/api/quizGames/getAvailableGames')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ games: responseJson.games});
        for (var i = 0; i < this.state.games.length; i++) {
          if(this.state.games[i].players.indexOf(localStorage.getItem('uid'))>-1 && this.state.games.length<2){
            this.setState({ joinedGame: true,gameId:this.state.games[i].id});
            socket.on('game_full_'+this.state.games[i].id, data => {
                let games = this.state.games;
                games[i] = data.game;
                this.setState({ games: games});
                this.startQuiz(this.state.games[i].id);
            });
          }
        }
      })
      .catch((error) => {
        console.error(JSON.stringify(error));
      });
      if(localStorage.getItem("uid")){
        this.setState({ userExists: true,uid: localStorage.getItem("uid")});
      }
  }
  setUserId(uid){
    if(uid){
      this.setState({ userExists: true,uid: uid});
    }
  }
  handleStop = (score) => {
    console.log('handle stop');
    
    let question = this.state.question;
    if(score === 0){
      if(!question.selectedOptions){
          question.selectedOptions = {};
      }
      question.selectedOptions[localStorage.getItem('uid')] = -1;
      this.setState({ start: false,question:question,selectedIndex:-1 });
    }
    this.setState({ score:score,overlayVisible:true })
    this.handleSelectedOption(question.selectedOptions[localStorage.getItem('uid')],score);
  }
  optionSelected = (option) => {
    console.log('optionSelected');
    this.setState({ start: false,selectedIndex:option,overlayVisible:true });
  }
  joinGame = (index,gameId) => {
      fetch(baseUrl+'/api/quizGames/'+gameId+'/join', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: localStorage.getItem('uid')
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.result.success){
          let games = this.state.games;
          games[index] = responseJson.result.game;
          this.setState({ games: games,joinedGame:true,gameId:gameId});
          if(this.state.games[index].status==='started'){
            this.startQuiz(gameId);
          }
        }
      })
      .catch((error) => {
        // console.log(JSON.stringify(error));
      });
      socket.on('game_full_'+gameId, data => {
        console.log("game full")
          let games = this.state.games;
          games[index] = data.game;
          this.setState({ games: games});
          this.startQuiz(gameId);
      });
  }
  startQuiz = (gameId) => {
      fetch(baseUrl+'/api/quizGames/'+gameId+'/startGame')
      .then((response) => response.json())
      .then((responseJson) => {
        let uid,oid;
        for(let i=0;i<responseJson.game.players.length;i++){
          if(responseJson.game.players[i]===localStorage.getItem('uid')){
            uid = responseJson.game.players[i];
          }else{
            oid = responseJson.game.players[i];
          }
        }
        this.setState({ start:true,currentIndex:0,currentGame: responseJson.game,scores: responseJson.scores,question: responseJson.question,inPlay: true,uid:uid,oid:oid,gameCompleted:false});
        socket.on('quiz_answered_'+oid, data => {
          let scores = this.state.scores;
          scores[oid] = data.scores;
          this.setState({ scores:scores,opponentIndex:data.ballIndex });
        });
        socket.on('game_completed_'+gameId, data => {
          console.log("game completed");
          setTimeout(()=>{
            this.setState({ gameCompleted:true });
          }, 5000);
        });
      })
      .catch((error) => {
        // console.error(JSON.stringify(error));
      });
  }

  handleSelectedOption = (option) => {
    let index = this.state.currentIndex;
    fetch(baseUrl+'/api/quizGames/'+this.state.currentGame.id+'/updateGameScore', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ballIndex: index,
        score: this.state.score,
        optionIndex: option,
        uid: localStorage.getItem('uid')
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({ scores: responseJson.scores });
        setTimeout(()=>{this.setState({ question:responseJson.question,overlayVisible:false, currentIndex: index+1,start:true })}, 5000);
        if(this.state.currentIndex>5){
            setTimeout(()=>{
              if(!this.state.gameCompleted){
                this.setState({ gameCompleted: true });
              }
            }, 30000);
        }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
      
  }
  render() {
    
    var games = [];
    for (var i = 0; i < this.state.games.length; i++) {
        const playersLength = this.state.games[i].players.length;
        let joinClass = (playersLength>=2 || this.state.games[i].players.indexOf(localStorage.getItem('uid'))>-1)? 'hide-btn' : '';
        let startClass = (playersLength>=2)? '' : 'hide-btn';
        let waitingClass = (this.state.games[i].players.indexOf(localStorage.getItem('uid'))>-1 && playersLength<2)? '' : 'hide-btn';
      
        games.push(<Grid.Column key={i}>
                        <Card className="content-center">
                          <Card.Content>
                            <Card.Header>
                              Start Game
                            </Card.Header>
                            <Card.Description>
                              2 Members Game
                              <Progress className='joinedPlayers' percent={this.state.games[i].players.length*50} size='small' success />
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div className='ui buttons'>
                              <Button className={joinClass} basic color='green' onClick={this.joinGame.bind(this, i,this.state.games[i].id)}>JOIN</Button>
                              <Button className={startClass} basic color='green' onClick={this.startQuiz.bind(this, this.state.games[i].id)}>Start</Button>
                              <Button className={waitingClass} basic color='green'>Waiting</Button>
                            </div>
                          </Card.Content>
                        </Card>
                      </Grid.Column>);
    }
    return (
      <div>
          {
            (localStorage.getItem("uid") || this.state.userExists)?
              (!this.state.inPlay && !this.state.joinedGame) ?
                  <Grid textAlign='center' className="start-game" verticalAlign='middle'>
                    <Grid.Row>
                      {games}
                    </Grid.Row>
                  </Grid>
              : (!this.state.inPlay && this.state.joinedGame) ?
                <WaitingGame gameId={this.state.gameId}></WaitingGame>
              :
                <div>
                  <PlayersScorePanelTop userScores={this.state.scores[this.state.uid]} opponentScores={this.state.scores[this.state.oid]}></PlayersScorePanelTop>
                  <GameScores opponentIndex={this.state.opponentIndex} currentIndex={this.state.currentIndex} userScores={this.state.scores[this.state.uid]} opponentScores={this.state.scores[this.state.oid]}></GameScores>
                  {
                    (!this.state.gameCompleted) ? 
                      <Container className='questions'>
                        <Overlay enable={this.state.overlayVisible}></Overlay>
                        {
                            (this.state.currentIndex > 5) ?
                            <Header as='h1' textAlign='center'>Waiting for other player to complete this game</Header>
                            :
                              <div>
                                <Timer start={this.state.start} onStop={this.handleStop}></Timer>
                                <Question question={this.state.question} onOptionSelected={this.optionSelected} currentIndex={this.state.currentIndex}></Question>
                              </div>
                        } 
                      </Container>
                    :
                      <GameWinner userScores={this.state.scores[this.state.uid]} opponentScores={this.state.scores[this.state.oid]}></GameWinner>
                  }
                </div>
            :
                <Login  onLogin={this.setUserId.bind(this)}></Login>

          }
      </div>
    );
  }
}

export default Quiz;
