export default function assignConcept( state = [], action) {
  switch (action.type) {
    case 'ASSIGN_CONCEPT':
      return [...state, action.payload]
      break;
    case 'CLEAR_CONCEPT':
        return []
        break;
    default:
      return state
  }
}
