import React, { Component } from 'react';
import { Container,Form, Input } from 'semantic-ui-react'
import './Quiz.css';

class Login extends Component {
  constructor() {
    super();
    this.state = { user:0 };
  }  
  handleUid = (e,data) => {
    this.setState({ user: data.value })
  }
  setUserId = () => {
    if(this.state.user){
      localStorage.setItem('uid', this.state.user);
      this.props.onLogin(this.state.user);
    }else{
      alert('Please enter user id');
    }
  }
  render() {
    return (
        <Container className="user-input" textAlign="center">
            <Form onSubmit={this.setUserId}>
                <Form.Group>
                    <Form.Field inline>
                    <label>User</label>
                    <Input placeholder='Enter UserId' name='user' onChange={this.handleUid} />
                    </Form.Field>
                <Form.Button content='Set' />
                </Form.Group>
            </Form>
        </Container>
    );
  }
}

export default Login;
