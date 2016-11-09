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
  original = stringMap.currentWord
  removed = stringMap.currentWord
  added = diffArray[i + 1][1]
  modified = stringMap.followingWord
  index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources

  if (stringMap.followingItemType === 1) { // text was removed and replaced

        if (stringMap.priorEndChar === " " && stringMap.following2StartChar === " ") { // tests for spaces on the preceeding and following words
        } else
        if ( stringMap.priorEndChar === " " ) { // tests for space at end of the preceeding word
            original += stringMap.following2Word
            modified += stringMap.following2Word
            index = stringOrig.split(" ").indexOf(original)
        } else if (stringMap.following2StartChar === " ") { // tests for space at start of the following word
            original = stringMap.priorWord + original  // orignially the code was diffArray[i-1][1] + original
            modified = stringMap.priorWord + stringMap.followingWord //diffArray[i-1][1] + diffArray[i+1][1]
        } else {
          console.log("other - error!!");
        }
    } else { // text was only removed - simple logic assuming always removing from the end of a string (i.e. removal of comma)- needs to be built out to acomodate for different types of text removal (preceding space, folllowing space, both pre/post space, etc)
      if (stringMap.priorEndChar === " " && stringMap.currentEndingChar === " ") { // removed entire word - preceeding word ends in space, current string ends in space
        added = null
        modified = " "
      } else if (stringMap.priorEndChar !== " " && stringMap.currentStartingChar !== " " && stringMap.currentEndingChar !==" " && stringMap.followingStartChar !== " " ) { // text was removed from middle of word - preceeding word ends with no space, current string starts with no space && current string ends with no space, following string ends with no space
        original = stringMap.priorWord + stringMap.currentWord + stringMap.followingWord
        added = null
        modified = stringMap.priorWord + stringMap.followingWord
        index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources
      } else if (stringMap.priorEndChar !== " " && stringMap.currentStartingChar !== " " && stringMap.followingStartChar === " ") { // text was removed from end of word - preceeding word ends with no space, current string starts with no space, following string starts with space
        original = stringMap.priorWord + stringMap.currentWord
        added = null
        modified = stringMap.priorWord
        index = stringOrig.split(" ").indexOf(original)
      } else if (stringMap.priorEndChar === " " &&  stringMap.currentStartingChar !== " " && stringMap.followingStartChar !== " ") { // text was removed from front of word - string starts with no space, preceeding word starts with space
        original += stringMap.followingWord
        index = stringOrig.split(" ").indexOf(original) //used only for comma case - need to accont for multiple occources
      } else {
        console.log("other - error!!");
      }
      return {original, removed, added, modified, index, countIncrease: 1}
    }


  function buildStringMap(diffArray, i) {
    let currentWord = diffArray[i][1]
    let priorWord = (diffArray[i-1][1]) ? lastWord(diffArray[i-1][1]) : null
    let priorEndChar = (priorWord) ? priorWord.slice(-1) : null // returns the last character from the string before, if it exists
    let followingWord = (diffArray[i + 1][1]) ? firstWord(diffArray[i + 1][1]) : null
    let followingStartChar = (followingStartChar) ? followingStartChar.slice(0, 1) : null //returns the first character of the following string, if it exists
    let following2Word = (diffArray[i + 2][1]) ? firstWord(diffArray[i + 2][1]) : null // returns the first word of one past the following string, if it exists - used when the immedatley following string is the addition text (not the following text)
    let following2StartChar = (following2Word) ? following2Word.slice(0, 1) : null //returns the first character of one past the following string, if it exists - used when the immedatley following string is the addition text (not the following text)
    let currentStartingChar = diffArray[i][1].slice(0, 1) //returns the starting character of the current string
    let currentEndingChar = diffArray[i][1].slice(-1) // returns the ending character of the current string
    let followingItemType = (diffArray[i+1]) ? diffArray[i+1][0] : null // returns the type of the folling item in the array, if it exists (-1 = subtraction, 0 = same, 1 = addition)
    return { currentWord, priorWord, priorEndChar, followingWord, followingStartChar, following2Word, following2StartChar, currentStartingChar, currentEndingChar, followingItemType}
    }

function addText(diffArray, i) { //needs to account for spaces - currently assuming text is always added on the end of the prior string
  var original = lastWord(diffArray[i-1][1])
  var removed = null
  var added = diffArray[i][1]
  var modified = original + added
  var index = stringOrig.split(" ").indexOf(original, i)
  return {original, removed, added, modified, index}
}

function lastWord(string) {
  var n = string.trim().split(" ")
  return n[n.length - 1]
}

function firstWord(string) {
  var n = string.split(" ")
  return n[0]
}
