import React, { Component } from 'react';
import { Container, Grid, Image, Header} from 'semantic-ui-react'
import './GameScores.css';

class GameScores extends Component {
  render() {
    var balls = [];
    
    for (var i = 0; i < 6; i++) {
      let rotateClass = (this.props.currentIndex === i) ? 'ball-rotate' : '';
      let uscore = (this.props.userScores[i] === -1) ? 'W' : this.props.userScores[i];
      let oscore = (this.props.opponentScores[i] === -1) ? 'w' : this.props.opponentScores[i];

      const imagepath = (this.props.currentIndex === i) ? 'BALL-ORANGE' : (this.props.currentIndex > i) ? 'BALL-RED' : 'BALL-WHITE';
      const scoreTextClass = (this.props.currentIndex >= i) ? 'scoreWhite' : 'scoreBlack'; 
      balls.push(
        <Grid.Column key={i} textAlign='center'>
          <Image width='50' src={require('./'+imagepath+'.png')} verticalAlign='middle' className={rotateClass} />
          {
                (this.props.currentIndex > i)?
                <Header as='h3' className={scoreTextClass}>{uscore}</Header>
                :
                ''
          }
          {
                (this.props.opponentScores[i] != void 0 && this.props.opponentIndex >= i) ?
                <Header as='h5' className='opponent-score'><span>{oscore}</span></Header>
                :
                ''
          } 
        </Grid.Column>
      );
    }
    return (
      <div className="scoresPanel">
        <Container>
            <Grid columns='equal'>
              <Grid.Row verticalAlign='middle'>
                <Grid.Column only='computer'></Grid.Column>
                <Grid.Column only='computer'></Grid.Column>
                {balls}
                <Grid.Column only='computer'></Grid.Column>
                <Grid.Column only='computer'></Grid.Column>
              </Grid.Row>
            </Grid>
        </Container>
      </div>
    );
  }
}

export default GameScores;
