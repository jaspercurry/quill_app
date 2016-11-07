import { combineReducers } from 'redux'
import textDiff from './textDiff'
import assignConcept from './assign_reducer'


const rootReducer = combineReducers({
  textDiff: textDiff,
  assignedConcepts: assignConcept
})

export default rootReducer
