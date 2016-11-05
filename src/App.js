import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



var stringOrig = "Elon Musk is a South African-born Canadian-American business magnate, investor, engineer, and inventor. Musk has stated that the goals of SolarCity, Tesla Motors, and SpaceX revolve around his vision to change the world"
var stringMod = "Elon Musk is an South African-born Canadian-American business magnate investor engineer ans inventor. musk has stated that the goals of SolarCity, Tesla Motors, and SpaceX revolve around his vision too change the world"
// var stringOrig = "I am the very model of a modern Major-General, I've information vegetable, animal, and mineral, I know the kings of England, and I quote the fights historical, From Marathon to Waterloo, in order categorical.";
// var stringMod = "I am the very model of a cartoon individual, My animation's comical, unusual, and whimsical, I'm quite adept at funny gags, comedic theory I have read, From wicked puns and stupid jokes to anvils that drop on your head.";

class App extends Component {

  diff(){

    var Diff = require('text-diff')
    var diff = new Diff({ timeout: 1, editCost: 4 })
    var textDiff = diff.main(stringOrig, stringMod);
    var clean = diff.cleanupSemantic(textDiff)
    this.cleanDiff(textDiff)
    console.log(textDiff);


  }


  cleanDiff(diffArray) {

    let i = 0
    var index = 0
    var finalArray = []
    while (i < diffArray.length - 1 ) {
      if (diffArray[i+1][0] === -1 && diffArray[i+2][0] === 1) {
        if (diffArray[i][1].slice(-1) === " ") { //look
          let removed = diffArray[i+1][1]
          let added = diffArray[i+2][1]
          let original = removed + this.firstWord(diffArray[i + 3][1])
          let modified = added + this.firstWord(diffArray[i + 3][1])
          index = stringOrig.split(" ").indexOf(original, index) // using this index of method with split means that this will not work for whole phrases - only single/partial words
          finalArray.push({original: original, modified: modified, index: index, removed: removed, added: added })
        } else {
          let removed = diffArray[i+1][1]
          let added = diffArray[i+2][1]
          let original = diffArray[i][1].trim() + removed
          let modified = diffArray[i][1].trim() + added
          index = stringOrig.split(" ").indexOf(original, index)
          finalArray.push({original: original, modified: modified, index: index, removed: removed, added: added })
        }
        i += 2
      } else if (diffArray[i+1][0] === 1) {
        let added = diffArray[i+1][1]
        let original = this.lastWord(diffArray[i][1])
        let modified = this.lastWord(diffArray[i][1]) + diffArray[i+1][1]
        index = stringOrig.split(" ").indexOf(original, index)
        finalArray.push({original: original, modified: modified, index: index, added: added })
        i += 1

      } else if (diffArray[i+1][0] === -1){
        let removed = diffArray[i+1][1]
        let original = this.lastWord(diffArray[i][1]) + diffArray[i+1][1]
        let modified = this.lastWord(diffArray[i][1])
        index = stringOrig.split(" ").indexOf(original, index)
        finalArray.push({original: original, modified: modified, index: index, removed: removed })
        i += 1
      } else {
        i += 1
      }
  }
  console.log(finalArray);
  this.arrayParser(finalArray)
  return finalArray

  }

  arrayParser(originalArray){
    let combinedArray = []

    for (var i = 0; i < originalArray.length; i++) {

      if (originalArray[i].index === originalArray[i + 1].index - 1 && originalArray[i].removed === ",") {
        debugger
        while (originalArray[i].index === originalArray[i + 1].index - 1) {
          originalArray[i + 1]
          let combindedObject = {original: originalArray[i].original + " " + originalArray[i + 1].original, modified: originalArray[i].modified + " " + originalArray[i + 1].modified}

          i += 1

        }
        let combindedObject = {original: originalArray[i].original + " " + originalArray[i + 1].original, modified: originalArray[i].modified + " " + originalArray[i + 1].modified}


      } else {

      }
    }

  }

  lastWord(string) {
    var n = string.split(" ")
    return n[n.length - 1]

  }

  firstWord(string) {
    var n = string.split(" ")
    return n[0]
  }

  render() {

    this.diff()

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
