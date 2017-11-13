import React, { Component } from 'react'
import { Progress } from 'semantic-ui-react'

export default class Timer extends Component {
  constructor() {
    super();
    this.state = { percent: 100, points: 6, color: 'green', intervalId: null,inProgress:false };
    this.startTimer = this.startTimer.bind(this);
    this.increment = this.increment.bind(this);
  }
  componentWillMount(){
    if(this.props.start){
      this.setState({ percent: 100, points: 6, color: 'green', intervalId: null });
      this.startTimer();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.start && !this.state.inProgress){
      console.log('restart');
      this.setState({ percent: 100, points: 6, color: 'green', intervalId: null,inProgress:true });
      this.startTimer();
    }
    if(!nextProps.start){
      this.setState({ inProgress:false });
      this.stopTimer();
    }
  }

  increment = () => { 
    let points = 6;
    let color = 'green';
    if( this.state.percent > (1/12)*100 ){
      points = 1;
      color = 'red'
    }

    if( this.state.percent > (4/12)*100 ){
      points = 2;
      color = 'orange'      
    }

    if( this.state.percent > (7/12)*100 ){
      points = 3;
      color = 'yellow'      
    }

    if( this.state.percent > (9/12)*100 ){
      points = 4;
      color = 'olive'
    }    

    if( this.state.percent > (11/12)*100 ){
      points = 6;
      color = 'green'
    }

    if( this.state.percent <= 100/12){
      points = 0;
      let intervalId = this.state.intervalId;
      this.setState({ intervalId: intervalId, points: 0,inProgress:false })
      this.stopTimer();
      this.setState({
        percent: 0,
        points: 0,
        color: 'black',
        intervalId: intervalId,inProgress:false
      })
    }else{
      this.setState({
        percent: this.state.percent - 100/12,
        points: points,
        color: color
      })
    }
  }

  startTimer = () => {
    //if (this.state.percent == 0) {
      this.setState({ percent: 100, points: 6, color: 'green', intervalId: null,inProgress:true });
      let intervalId = null;
      intervalId = setInterval(this.increment.bind(this), 1000);
      this.setState({ intervalId: intervalId });
    //}
  }

  stopTimer = () => {
    if(this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: null });
      this.props.onStop(this.state.points);
    }
  }
  //12 seconds 2+2+2+3+3 12,11=6; 10,9=4; 8,7=3; 6,5,4=2; 3,2,1=1; 0=0

  render() {
    return (
      <div>
        <Progress percent={this.state.percent} color={this.state.color} value={this.state.points} total='6' progress="ratio"/>
      </div>
    )
  }
}