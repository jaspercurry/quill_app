export default function textDiff( state = [], action) {
  switch (action.type) {
    case 'DIFF_TEXT':
      return action.payload
    case 'CLEAR_DIFF':
      return []
    default:
      return state
  }
}
