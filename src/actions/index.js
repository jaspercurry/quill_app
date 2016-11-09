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


  // function cleanDiff(diffArray) {
  //   let finalArray = []
  //   for (var i = 0; i < diffArray.length; i++ ) {
  //     let editType = diffArray[i][0] // will either be -1 (removal), 0 (no change), 1 (addition)
  //
  //     switch (editType) {
  //       case -1:
  //         let rmDiffObject = removeText(diffArray, i)
  //         finalArray.push(rmDiffObject)
  //         i += rmDiffObject.countIncrease // the i count is increase by an additonal +1 depending on if the subtraction was followed by an addiion - should look into refactoring
  //         break;
  //       case 0: //not nessisary
  //         break
  //       case 1:
  //         let adDiffObject = addText(diffArray, i)
  //         finalArray.push(adDiffObject)
  //         break
  //       default:
  //         break
  //       }
  //   }
  //   return arrayParser(finalArray)
  // }


  function cleanDiff(diffArray, i) {

    let processedDiffs = []
    for (var i = 0; i < diffArray.length; i++ ) {
      let editType = diffArray[i][0] // will either be -1 (removal), 0 (no change), 1 (addition)


      if (editType === -1 ) {
        let rmDiffObject = removeText(diffArray, i)
        processedDiffs.push(rmDiffObject)
        i += rmDiffObject.countIncrease // the i count is increase by an additonal +1 depending on if the subtraction was followed by an addiion - should look into refactoring
      } else if (editType === 1) {
        processedDiffs.push(addText(diffArray, i))
      }
    }
    return arrayParser(processedDiffs)

  }

  function removeText(diffArray, i) {

    var stringMap = buildStringMap(diffArray, i)
    var original = stringMap.currentWord
    var removed = stringMap.currentWord
    var added = stringMap.followingWord
    var modified = stringMap.followingWord
    var index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources

    if (stringMap.followingItemType === 1) { // text was removed and replaced

          if (stringMap.priorEndChar === "" && stringMap.following2StartChar === " ") { // tests for spaces on the preceeding and following words

          } else
          if ( stringMap.priorEndChar === "" ) { // tests for space at end of the preceeding word

              original += stringMap.following2Word
              modified += stringMap.following2Word
              index = stringOrig.split(" ").indexOf(original)
          } else if (stringMap.following2StartChar === " ") { // tests for space at start of the following word
              original = stringMap.priorWord + original  // orignially the code was diffArray[i-1][1] + original
              modified = stringMap.priorWord + stringMap.followingWord //diffArray[i-1][1] + diffArray[i+1][1]
          } else {
            debugger
            console.log("other - error #1");
          }
      } else { // text was only removed - simple logic assuming always removing from the end of a string (i.e. removal of comma)- needs to be built out to acomodate for different types of text removal (preceding space, folllowing space, both pre/post space, etc)
        if (stringMap.priorEndChar === "" && stringMap.currentEndingChar === " ") { // removed entire word - preceeding word ends in space, current string ends in space
          added = null
          modified = "N/A"
          debugger
        } else if (stringMap.priorEndChar !== "" && stringMap.currentStartingChar !== " " && stringMap.currentEndingChar !==" " && stringMap.followingStartChar !== "" ) { // text was removed from middle of word - preceeding word ends with no space, current string starts with no space && current string ends with no space, following string ends with no space
          original = stringMap.priorWord + stringMap.currentWord + stringMap.followingWord
          added = null
          debugger
          modified = stringMap.priorWord + stringMap.followingWord
          index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources
        } else if (stringMap.priorEndChar !== "" && stringMap.currentStartingChar !== " " && stringMap.followingStartChar === "") { // text was removed from end of word - preceeding word ends with no space, current string starts with no space, following string starts with space
          original = stringMap.priorWord + stringMap.currentWord
          added = null
          modified = stringMap.priorWord
          debugger
          index = stringOrig.split(" ").indexOf(original)
        } else if (stringMap.priorEndChar === "" && stringMap.currentEndingChar !== " " && stringMap.followingStartChar !== "") { // text was removed from start of word
          original = stringMap.currentWord + stringMap.followingWord
          added = null
          modified = stringMap.followingWord
          debugger
          index = stringOrig.split(" ").indexOf(original)
        } else {
          debugger
          console.log("other - error #2");
        }
        return {original, removed, added, modified, index, countIncrease: 1}
      }
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


//   function removeText(diffArray, i) { // types of removal: just remove (from fron of word, from end of word, entire word/words), remove and replace
//
//     let priorEnd = (diffArray[i - 1][1]) ? diffArray[i - 1 ][1].slice(-1) : undefined
//
//     let nextMod = (diffArray[i+1]) ? diffArray[i+1][0] : null
//
//     var original
//     var removed
//     var added
//     var modified
//     var index
//
//     if (nextMod === 1) { // text was removed and replaced
//       let followingStart = (diffArray[i + 2][1]) ? diffArray[i + 2][1].slice(0, 1) : null
//           if (priorEnd === " " && followingStart === " ") { // tests for spaces for preceeding and following word
//               original = diffArray[i][1]
//               removed = diffArray[i][1]
//               added = diffArray[i + 1][1]
//               modified = diffArray[i+1][1]
//               index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources
//           } else if ( priorEnd === " " ) { // tests for space at end of the preceeding word
//               original = diffArray[i][1] + firstWord(diffArray[i + 2][1])
//               removed = diffArray[i][1]
//               added = diffArray[i + 1][1]
//               modified = diffArray[i+1][1] + firstWord(diffArray[i + 2][1])
//               index = stringOrig.split(" ").indexOf(original)
//           } else if (followingStart === " ") { // tests for space at start of the following word
//               original = diffArray[i-1][1] + diffArray[i][1]
//               removed = diffArray[i][1]
//               added = diffArray[i +1 ][1]
//               modified = diffArray[i-1][1] + diffArray[i+1][1]
//               index = stringOrig.split(" ").indexOf(original)
//           } else {
//             console.log("other - error!!");
//           }
//           return {original, removed, added, modified, index, countIncrease: 1}
//       } else { // text was only removed - simple logic assuming always removing from the end of a string (i.e. removal of comma)- needs to be built out to acomodate for different types of text removal (preceding space, folllowing space, both pre/post space, etc)
//         // removed entire word - preceeding word ends in space, current string ends in space
//         // text was removed from middle of word - preceeding word ends with no space, current string starts with no space && current string ends with no space, following string ends with no space
//         // text was removed from end of word - preceeding word ends with no space, current string starts with no space, following string starts with space
//         // text was removed from front of word - string starts with no space, preceeding word starts with space
// debugger
//
//           original = lastWord(diffArray[i-1][1]) + diffArray[i][1]
//           removed = diffArray[i][1].trim()
//           added = null
//           modified = lastWord(diffArray[i-1][1])
//           index = stringOrig.split(" ").indexOf(original)
//           return {original, removed, added, modified, index, countIncrease: 0 }
//         }
//       }

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
