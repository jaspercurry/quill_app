import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from './actions'
import { bindActionCreators } from 'redux'
import logo from './quill_logo.png';
import './App.css';
import TextArea from './components/text_area'
import Table from './components/table'
import TextContainer from './components/text_container'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {original: "", edited: ""}
    this.originalText = this.originalText.bind(this)
    this.editedText = this.editedText.bind(this)
    this.assignConcept = this.assignConcept.bind(this)
    this.reset = this.reset.bind(this)
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

  reset(){
    this.setState({original: "", edited: ""})
    this.props.actions.clearDiffText()
    this.props.actions.clearConcept()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to my Quill App</h2>
        </div>
        {this.state.edited === "" ?
          <div>
          <TextArea originalText={this.originalText} editedText={this.editedText}/>

          <br></br>
          </div>
            :
            <div>
              <TextContainer title={"Original:"} text={this.state.original}/>
              <TextContainer title={"Edited:"} text={this.state.edited}/>
                <div className="text">
                  <h2>Differences:</h2>
                  {this.htmlDiv()}
                </div>
              <Table textDiff={this.props.textDiff} assignConcept={this.assignConcept}/>
              <button onClick={this.reset}>Reset</button>

            </div>
        }



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
