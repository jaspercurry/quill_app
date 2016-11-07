export default function assignConcept( state = [], action) {
  switch (action.type) {
    case 'ASSIGN_CONCEPT':
      return [...state, action.payload]
    default:
      return state
  }
}
