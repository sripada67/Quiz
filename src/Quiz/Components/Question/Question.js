import React, { Component } from 'react';
import { Container, Header, Button, Grid, Image } from 'semantic-ui-react'
import './Question.css';
import Timer from '../Timer/Timer';
import Overlay from '../Overlay/Overlay';
import qImg from './q-img.jpg';

class Question extends Component {
  state = { score: 0, question: this.props.question, currentIndex: this.props.currentIndex,selectedIndex:-1,selectedOptionValue:null }
  
  componentDidMount() {
    
  }


  optionSelected = (index,optionValue) => {
    let question = this.state.question;
    if(!question.selectedOptions){
        question.selectedOptions = {};
    }
    question.selectedOptions[localStorage.getItem('uid')] = index;
    this.setState({ question:question,selectedIndex:index,selectedOptionValue:optionValue });
    this.props.onOptionSelected(question.selectedOptions[localStorage.getItem('uid')]);
  }
  
  componentWillReceiveProps=(nextProps)=>{
     if(this.state.currentIndex != nextProps.currentIndex){
      console.log("------------------------next question-----------------------------");
      this.setState({ question:nextProps.question,currentIndex: nextProps.currentIndex,selectedIndex:-1 })
     }
  }

  render() {
    const { question, currentIndex } = this.state;
    var options = [];
    let currentQuestion;
    currentQuestion = this.state.question;
    for (var i = 0; i < currentQuestion.options.length; i++) {
        options.push(
          <Button toggle active={this.state.selectedIndex === i} as='h4' className='option' onClick={this.optionSelected.bind(this, i,currentQuestion.options[i])}>
            {currentQuestion.options[i]}
          </Button>
        );
    }
    return (
        <div>
          <Header as='h2'>{currentIndex+1}.) {question.question}</Header>
          <Grid columns="2" doubling reversed='computer'>
            <Grid.Row>
              <Grid.Column>
                <Image src={qImg} verticalAlign='middle' />
              </Grid.Column>
              <Grid.Column>
                {options}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default Question;
