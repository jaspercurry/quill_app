import React from 'react'

const Table = (props) => {

  return(
    <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Original</th>
            <th>Modified</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {props.textDiff.text.map((diff) => { return (
            <tr key={diff.index}>
              <td>{diff.original}</td>
              <td>{diff.modified}</td>
              <td><select onChange={ (e) => props.assignConcept(e, diff) } defaultValue='default'>
                <option disabled value="default" >-- select an option --</option>
                <option value="article">Article</option>
                <option value="comma">Comma</option>
                <option value="propNoun">Proper Noun</option>
              </select></td>
            </tr>
            )
          })}
      </tbody>
    </table>
  )
}

export default Table;
