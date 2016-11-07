export function assignConcept(concept, object) {

  object.concept = concept

  return { type: 'ASSIGN_CONCEPT',
            payload: object
          }
}

export function clearDiffText() {
  return { type: 'CLEAR_DIFF'
          }

 }

export function clearConcept() {
  return { type: 'CLEAR_CONCEPT'
          }

 }

export function diffText(stringOrig, stringMod) {


  function diff(){

    var Diff = require('text-diff')
    var diff = new Diff()
    var textDiff = diff.main(stringOrig, stringMod);
    diff.cleanupSemantic(textDiff) // alters the textDiff value to be more human readable.
    // the output is an array of arrays, each sub-array has two values. sub-array[0] is either -1, 0, or 1. -1 signifies text removal. 0 signifies no change. 1 signifies text addition. sub-array[1] contains the corresponding text relating to the change - or the unaltered text if sub-array[0] = 0
    return {text: cleanDiff(textDiff), html: diff.prettyHtml(textDiff)}
  }


  function cleanDiff(diffArray) {
    let finalArray = []
    for (var i = 0; i < diffArray.length; i++ ) {
      let editType = diffArray[i][0] // will either be -1 (removal), 0 (no change), 1 (addition)

      switch (editType) {
        case -1:
          let rmDiffObject = removeText(diffArray, i)
          finalArray.push(rmDiffObject)
          i += rmDiffObject.countIncrease // the i count is increase by an additonal +1 depending on if the subtraction was followed by an addiion - should look into refactoring
          break;
        case 0: //not nessisary
          break
        case 1:
          let adDiffObject = addText(diffArray, i)
          finalArray.push(adDiffObject)
          break
        default:
          break
        }
    }
    return arrayParser(finalArray)
  }

  function removeText(diffArray, i) { // types of removal: just remove (from fron of word, from end of word, entire word/words), remove and replace

    let priorEnd = (diffArray[i - 1][1]) ? diffArray[i - 1 ][1].slice(-1) : null

    let nextMod = (diffArray[i+1]) ? diffArray[i+1][0] : null

    var original
    var removed
    var added
    var modified
    var index

    if (nextMod === 1) { // text was removed and replaced
      let followingStart = (diffArray[i + 2][1]) ? diffArray[i + 2][1].slice(0, 1) : null
          if (priorEnd === " " && followingStart === " ") { // tests for spaces for preceeding and following word
              original = diffArray[i][1]
              removed = diffArray[i][1]
              added = diffArray[i + 1][1]
              modified = diffArray[i+1][1]
              index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources
          } else if ( priorEnd === " " ) { // tests for space at end of the preceeding word
              original = diffArray[i][1] + firstWord(diffArray[i + 2][1])
              removed = diffArray[i][1]
              added = diffArray[i + 1][1]
              modified = diffArray[i+1][1] + firstWord(diffArray[i + 2][1])
              index = stringOrig.split(" ").indexOf(original)
          } else if (followingStart === " ") { // tests for space at start of the following word
              original = diffArray[i-1][1] + diffArray[i][1]
              removed = diffArray[i][1]
              added = diffArray[i +1 ][1]
              modified = diffArray[i-1][1] + diffArray[i+1][1]
              index = stringOrig.split(" ").indexOf(original)
          } else {
            console.log("other - error!!");
          }
          return {original, removed, added, modified, index, countIncrease: 1}
      } else { // text was only removed - simple logic assuming always removing from the end of a string (i.e. removal of comma)- needs to be built out to acomodate for different types of text removal (preceding space, folllowing space, both pre/post space, etc)
          original = lastWord(diffArray[i-1][1]) + diffArray[i][1]
          removed = diffArray[i][1].trim()
          added = null
          modified = lastWord(diffArray[i-1][1])
          index = stringOrig.split(" ").indexOf(original)
          return {original, removed, added, modified, index, countIncrease: 0 }
        }
      }

  function addText(diffArray, i) { //needs to account for spaces - currently assuming text is always added on the end of the prior string
    var original = lastWord(diffArray[i-1][1])
    var removed = null
    var added = diffArray[i][1]
    var modified = original + added
    var index = stringOrig.split(" ").indexOf(original, i)
    return {original, removed, added, modified, index}
  }

  function arrayParser(originalArray) {
    var combinedArray = []

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
    return combinedArray
  }

  function lastWord(string) {
    var n = string.trim().split(" ")
    return n[n.length - 1]
  }

  function firstWord(string) {
    var n = string.split(" ")
    return n[0]
  }


  return { type: 'DIFF_TEXT',
            payload: diff()
        }
}
