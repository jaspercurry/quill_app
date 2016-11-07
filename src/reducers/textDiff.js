export default function textDiff( state = [], action) {
  switch (action.type) {
    case 'DIFF_TEXT':
    debugger
      return action.payload
    default:
      return state
  }
}
