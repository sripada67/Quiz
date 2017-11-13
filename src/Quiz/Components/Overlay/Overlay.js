import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import './Overlay.css';
import ReactCountdownClock from 'react-countdown-clock';

export default class Overlay extends Component {
  constructor() {
  super();
    this.state = { enable: false,count:5,start:false };
  }
  componentWillReceiveProps=(nextProps)=>{
    this.setState({ enable:nextProps.enable });
  }
  render() {
    const overlayClass = (this.state.enable) ? 'overlayOn' : '';
    return (
      <div id="overlay" className={overlayClass}>
        {
          (this.state.enable) ?
            <ReactCountdownClock seconds={5} color="#000" size={100} showMilliseconds={false} />
            :
           (this.state.start) ?
            <Header as='h1' className='react-countdown-clock' color="orange">Loading Game......</Header>
            :
            ''
        }
      </div>
    )
  }
}