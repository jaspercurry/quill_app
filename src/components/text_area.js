import React from 'react';
import {connect} from 'react-redux'
import * as actions from '../actions'
import { bindActionCreators } from 'redux'




class TextArea extends React.Component{
  constructor(props){
    super(props)
    this.state = {originalSubmit: true, modSumbit: true}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    e.preventDefault()
    if (this.state.originalSubmit) {
      this.props.originalText(this.refs.text.value)
      this.setState({originalSubmit: false})
    }
    if (this.state.originalSubmit === false) {
      this.props.editedText(this.refs.text.value)
    }
  }

  render(){
    return (
    <div >
      <form onSubmit={this.handleChange}>
        <textarea ref="text" placeholder='Enter text here...' name="Text1" cols="80" rows="7"></textarea>
        <br></br>
        <input type="submit"/>
      </form>
  </div>)
  }
}

export default TextArea;
