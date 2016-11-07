import React from 'react'

const TextContainer = (props) => {

  return(
    <div className="text">
      <h2> {props.title}</h2>
      {props.text}
      <br></br>
    </div>
  )
}

export default TextContainer;
