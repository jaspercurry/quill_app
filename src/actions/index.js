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
    diff.cleanupSemantic(textDiff) // the output is an array of arrays, each sub-array has two values. sub-array[0] is either -1, 0, or 1. -1 signifies text removal. 0 signifies no change. 1 signifies text addition. sub-array[1] contains the corresponding text relating to the change - or the unaltered text if sub-array[0] = 0
    return {text: cleanDiff(textDiff), html: diff.prettyHtml(textDiff)}
  }

  function cleanDiff(diffArray, i) {
    let processedDiffs = []
    for (var i = 0; i < diffArray.length; i++ ) {
      let stringMap = buildStringMap(diffArray, i)
      let editType = diffArray[i][0] // will either be -1 (removal), 0 (no change), 1 (addition)
        if (editType === -1 ) {
            if (stringMap.followingItemType === 1) {
              processedDiffs.push(removeOrAddText(stringMap, "replaced"))
              i +=1 // the i count is increase by an additonal +1 because the text subtraction was followed by a text addition
            } else {
              processedDiffs.push(removeOrAddText(stringMap, "removed"))
            }
        } else if (editType === 1) {
          processedDiffs.push(removeOrAddText(stringMap, "added"))
        }
      }
    return arrayParser(processedDiffs)
  }

  function buildStringMap(diffArray, i) {
      let currentWord = diffArray[i][1]
      let priorWord = (diffArray[i-1]) ? lastWord(diffArray[i-1][1]) : ""
      let priorEndChar = (priorWord) ? priorWord.slice(-1) : "" // returns the last character from the string before, if it exists
      let followingWord = (diffArray[i + 1]) ? firstWord(diffArray[i + 1][1]) : ""
      let followingStartChar = (followingWord) ? followingWord.slice(0, 1) : "" //returns the first character of the following string, if it exists
      let following2Word = (diffArray[i + 2]) ? firstWord(diffArray[i + 2][1]) : "" // returns the first word of one past the following string, if it exists - used when the immedatley following string is the addition text (not the following text)
      let following2StartChar = (following2Word) ? following2Word.slice(0, 1) : "" //returns the first character of one past the following string, if it exists - used when the immedatley following string is the addition text (not the following text)
      let currentStartingChar = diffArray[i][1].slice(0, 1) //returns the starting character of the current string
      let currentEndingChar = diffArray[i][1].slice(-1) // returns the ending character of the current string
      let followingItemType = (diffArray[i+1]) ? diffArray[i+1][0] : "" // returns the type of the folling item in the array, if it exists (-1 = subtraction, 0 = same, 1 = addition)

      return { currentWord, priorWord, priorEndChar, followingWord, followingStartChar, following2Word, following2StartChar, currentStartingChar, currentEndingChar, followingItemType}
    }

  function removeOrAddText(stringMap, type) { // needs to be broken down into sub-functions; indexOf method is problematic if words are repeated (needs fundamental change in logic)
    var original, removed, added, modified, index

    if (stringMap.priorEndChar === "" && stringMap.currentEndingChar === " ") { // removed or added an entire word
        if (type === "added") {
          original = "N/A"
          added = stringMap.currentWord
          removed = null
          modified = stringMap.currentWord
          index = stringMod.split(" ").indexOf(modified)
        } else if (type === "removed") {
          original = stringMap.currentWord
          added = null
          removed = stringMap.currentWord
          modified = "N/A"
          index = stringOrig.split(" ").indexOf(original)
        } else if (type === "replaced") {
          original = stringMap.currentWord
          added = stringMap.followingWord
          removed = stringMap.currentWord
          modified = stringMap.followingWord
          index = stringOrig.split(" ").indexOf(original)
        }
    } else if (stringMap.priorEndChar !== "" && stringMap.currentStartingChar !== " " && stringMap.currentEndingChar !==" " && stringMap.followingStartChar !== "" ) { // text was removed or added from middle of word
        if (type === "added") {
          original = stringMap.priorWord + stringMap.followingWord
          added = stringMap.currentWord
          removed = null
          modified = stringMap.priorWord + stringMap.currentWord + stringMap.followingWord
          index = stringMod.split(" ").indexOf(modified)
        } else if (type === "removed") {
          original = stringMap.priorWord + stringMap.currentWord + stringMap.followingWord
          added = null
          removed = stringMap.currentWord
          modified = stringMap.priorWord + stringMap.followingWord
          index = stringOrig.split(" ").indexOf(original)
        } else if (type === "replaced") {
          original = stringMap.priorWord + stringMap.currentWord + stringMap.following2Word
          added = stringMap.followingWord
          removed = stringMap.currentWord
          modified = stringMap.priorWord + stringMap.followingWord + stringMap.following2Word
          index = stringOrig.split(" ").indexOf(original)
        }
    } else if (stringMap.priorEndChar !== "" && stringMap.currentStartingChar !== " " && stringMap.followingStartChar === "") { // text was removed or added from end of word
        if (type === "added") {
          original = stringMap.priorWord
          added = stringMap.currentWord
          removed = null
          modified = stringMap.priorWord + stringMap.currentWord
          index = stringMod.split(" ").indexOf(modified)
        } else if (type === "removed") {
          original = stringMap.priorWord + stringMap.currentWord
          added = null
          removed = stringMap.currentWord
          modified = stringMap.priorWord
          index = stringOrig.split(" ").indexOf(original)
        } else if (type === "replaced") {
          original = stringMap.priorWord + stringMap.currentWord
          added = stringMap.followingWord
          removed = stringMap.currentWord
          modified = stringMap.priorWord + stringMap.followingWord
          index = stringOrig.split(" ").indexOf(original)
        }
    } else if (stringMap.priorEndChar === "" && stringMap.currentEndingChar !== " " && stringMap.followingStartChar !== "") { // text was removed or added to the start of word
        if (type === "added") {
          original = stringMap.followingWord
          added = stringMap.currentWord
          removed = null
          modified = stringMap.currentWord + stringMap.followingWord
          index = stringMod.split(" ").indexOf(modified)
        } else if (type === "removed") {
          original = stringMap.currentWord + stringMap.followingWord
          added = null
          removed = stringMap.currentWord
          modified = stringMap.followingWord
          index = stringOrig.split(" ").indexOf(original)
        } else if (type === "replaced") {
          original = stringMap.currentWord + stringMap.following2Word
          added = stringMap.followingWord
          removed = stringMap.currentWord
          modified = stringMap.followingWord + stringMap.following2Word
          index = stringOrig.split(" ").indexOf(original)
        }
    } else {
      console.log("other - error #2"); // there are some edge cases with first and last words being added/removed + modifications to multiple parts of a single word
    }
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
    return combinedArray
  }

  function lastWord(string) {
    var n = string.split(" ")
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
