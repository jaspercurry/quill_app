import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from './actions'
import { bindActionCreators } from 'redux'
import logo from './quill_logo.png';
import './App.css';
import TextArea from './components/text_area'
import Table from './components/table'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {original: "", edited: ""}
    this.originalText = this.originalText.bind(this)
    this.editedText = this.editedText.bind(this)
    this.assignConcept = this.assignConcept.bind(this)
  }

  originalText(text) {
    this.setState({ original: text })

  }

  editedText(text) {
    this.setState({ edited: text })
    this.props.actions.diffText(this.state.original, text)
  }

  htmlDiv() {
    if (this.props.textDiff.html) {
      return <div dangerouslySetInnerHTML={{__html: this.props.textDiff.html}}/>
    }
  }

  assignConcept(e, modObject) {
    this.props.actions.assignConcept(e.target.value, modObject)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to my Quill App</h2>
        </div>
        <TextArea originalText={this.originalText} editedText={this.editedText}/>
          <div className="text">
            <h2> Original:</h2>
            {this.state.original}
            <br></br>
            <h2>Edited:</h2>
            {this.state.edited}
          </div>
            <br></br>
          <Table textDiff={this.props.textDiff} assignConcept={this.assignConcept}/>
            <br></br>
          <div className="text">
            <h2>Differences:</h2>
            {this.htmlDiv()}
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.textDiff.text) {
    return {textDiff: state.textDiff, assignedConcepts: state.assignedConcepts}
  } else {
      return {textDiff: {text: []}, assignedConcepts: state.assignedConcepts}
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) }
}

const componentCreator = connect(mapStateToProps, mapDispatchToProps)
export default componentCreator(App);
