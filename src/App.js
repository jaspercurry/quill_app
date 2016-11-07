import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




var stringOrig = "Elon Musk is a South African-born Canadian-American business magnate, investor, engineer, and inventor. Musk has stated that the goals of SolarCity, Tesla Motors, and SpaceX revolve around his vision to change the world"
var stringMod = "Elon Musk is an South African-born Canadian-American business magnate investor engineer and inventor. musk has stated that the goals of SolarCity, Tesla Motors, and SpaceX revolve around his vision too change the world"
// var stringOrig = "I am the very model of a modern Major-General, I've information vegetable, animal, and mineral, I know the kings of England, and I quote the fights historical, From Marathon to Waterloo, in order categorical.";
// var stringMod = "I am the very model of a cartoon individual, My animation's comical, unusual, and whimsical, I'm quite adept at funny gags, comedic theory I have read, From wicked puns and stupid jokes to anvils that drop on your head.";

class App extends Component {

  diff(){

    var Diff = require('text-diff')
    var diff = new Diff()
    var textDiff = diff.main(stringOrig, stringMod);
    diff.cleanupSemantic(textDiff) // alters the textDiff value to be more human readable.
    // the output is an array of arrays, each sub-array has two values. sub-array[0] is either -1, 0, or 1. -1 signifies text removal. 0 signifies no change. 1 signifies text addition. sub-array[1] contains the corresponding text relating to the change - or the unaltered text if sub-array[0] = 0

    console.log("origninal diff");
    console.log(textDiff);

    console.log("Clean diff");
    this.cleanDiff(textDiff)


  }


  cleanDiff(diffArray) {
    let finalArray = []

    for (var i = 0; i < diffArray.length; ) {

      let editType = diffArray[i][0] // will either be -1 (removal), 0 (no change), 1 (addition)

      switch (editType) {
        case -1:
          let rmDiffObject = this.removeText(diffArray, i)

          finalArray.push(rmDiffObject)
          i += rmDiffObject.countIncrease // the i count is increase by +1 or +2 depending on if the was followed by an addiion - should look into refactoring
          break;
        case 1:
          let adDiffObject = this.addText(diffArray, i)
          finalArray.push(adDiffObject)
          i++
          break
        default:
          i++
      }
    }
    console.log(finalArray);
    this.arrayParser(finalArray)

  }

  removeText(diffArray, i) { // types of removal: just remove (from fron of word, from end of word, entire word/words), remove and replace

    let priorEnd = (diffArray[i - 1][1]) ? diffArray[i - 1 ][1].slice(-1) : null

    let nextMod = (diffArray[i+1]) ? diffArray[i+1][0] : null

    if (nextMod === 1) { // text was removed and replaced
      let followingStart = (diffArray[i + 2][1]) ? diffArray[i + 2][1].slice(0, 1) : null
          if (priorEnd == " " && followingStart == " ") { // tests for spaces for preceeding and following word
              var original = diffArray[i][1]
              var removed = diffArray[i][1]
              var added = diffArray[i + 1][1]
              var modified = diffArray[i+1][1]
              var index = stringOrig.split(" ").indexOf(original, i) //used only for comma case
          } else if ( priorEnd == " " ) { // tests for space at end of the preceeding word
              var original = diffArray[i][1] + this.firstWord(diffArray[i + 2][1])
              var removed = diffArray[i][1]
              var added = diffArray[i + 1][1]
              var modified = diffArray[i+1][1] + this.firstWord(diffArray[i + 2][1])
              var index = stringOrig.split(" ").indexOf(original, i)
          } else if (followingStart == " ") { // tests for space at start of the following word
              var original = diffArray[i-1][1] + diffArray[i][1]
              var removed = diffArray[i][1]
              var added = diffArray[i +1 ][1]
              var modified = diffArray[i-1][1] + diffArray[i+1][1]
              var index = stringOrig.split(" ").indexOf(original, i)
          } else {
            console.log("other - error!!");
          }
          return {original, removed, added, modified, index, countIncrease: 2}
      } else { // text was only removed - simple logic assuming always removing from the end of a string (i.e. removal of comma)- needs to be built out to acomodate for different types of text removal (preceding space, folllowing space, both pre/post space, etc)
        var original = this.lastWord(diffArray[i-1][1]) + diffArray[i][1]
        var removed = diffArray[i][1].trim()
        var added = null
        var modified = this.lastWord(diffArray[i-1][1])
        var index = stringOrig.split(" ").indexOf(original, i)
        return {original, removed, added, modified, index, countIncrease: 1 }
        }

      }

      addText(diffArray, i) { //needs to account for spaces - currently assuming text is always added on the end of the prior string
        var original = this.lastWord(diffArray[i-1][1])
        var removed = null
        var added = diffArray[i][1]
        var modified = original + added
        var index = stringOrig.split(" ").indexOf(original, i)
        return {original, removed, added, modified, index}
      }




    // let i = 0
    // var index = 0
    // var finalArray = []
    // while (i < diffArray.length - 1) { // need to fix the -1 hack. does not evaluate the last diff in the array
    //   if (diffArray[i+1][0] === -1 && diffArray[i+2][0] === 1) { // Used to detect if there was a text removal and then an addition.
    //     if (diffArray[i][1].slice(-1) === " ") { // detects if the edit was made to the beggining of a word
    //
    //       let removed = diffArray[i+1][1]
    //       let added = diffArray[i+2][1]
    //       let original = removed + this.firstWord(diffArray[i + 3][1])
    //       let modified = added + this.firstWord(diffArray[i + 3][1])
    //       index = stringOrig.split(" ").indexOf(original, index) // using this index of method with split means that this will not work for whole phrases - only single/partial words - used exclusivly for sequential comma detection
    //       finalArray.push({original: original, modified: modified, index: index, removed: removed, added: added })
    //     } else {
    //       let removed = diffArray[i+1][1]
    //       let added = diffArray[i+2][1]
    //       let original = diffArray[i][1].trim() + removed
    //       let modified = diffArray[i][1].trim() + added
    //       index = stringOrig.split(" ").indexOf(original, index)
    //       finalArray.push({original: original, modified: modified, index: index, removed: removed, added: added })
    //     }
    //     i += 2
    //   } else if (diffArray[i+1][0] === 1) {
    //     debugger
    //     let added = diffArray[i+1][1]
    //     let original = this.lastWord(diffArray[i][1])
    //     let modified = this.lastWord(diffArray[i][1]) + diffArray[i+1][1]
    //     index = stringOrig.split(" ").indexOf(original, index)
    //     finalArray.push({original: original, modified: modified, index: index, added: added })
    //     i += 1
    //
    //   } else if (diffArray[i+1][0] === -1){
    //     let removed = diffArray[i+1][1]
    //     let original = this.lastWord(diffArray[i][1]) + diffArray[i+1][1]
    //     let modified = this.lastWord(diffArray[i][1])
    //     index = stringOrig.split(" ").indexOf(original, index)
    //     finalArray.push({original: original, modified: modified, index: index, removed: removed })
    //     i += 1
    //   } else {
    //     i += 1
    //   }
  // }
  // console.log(finalArray);
  // this.arrayParser(finalArray)
  // return finalArray



  arrayParser(originalArray) {
    let combinedArray = []

    for (var i = 0; i < originalArray.length; i++) {
      let adjacency = (originalArray[i + 1]) ? originalArray[i].index === originalArray[i + 1].index - 1 : false // need this logic because for the last element of the array, i + 1 is not defined.
      let commadiff = originalArray[i].removed === "," || originalArray[i].added === ",";

      if (adjacency && commadiff) {
        originalArray[i + 1].original = originalArray[i].original + " " + originalArray[i + 1].original
        originalArray[i + 1].modified = originalArray[i].modified + " " + originalArray[i + 1].modified
      } else {
        combinedArray.push(originalArray[i])
      }
    }
    console.log(combinedArray);
  }

  lastWord(string) {
    var n = string.trim().split(" ")
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
