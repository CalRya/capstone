import React from 'react'
import '../../CSS FOLDER/Hero.css'
import dark_arrow from '../../../assets/arrow.png'

const Hero = () => {
  return (
    <div className= 'Hero container'>
      <div className="hero-text">
        <h1> Calling all Literature Nerds! </h1> <br/>
        <p> The Digital Library provides access to a wide range of resources for students who have a unique passion for literature, those in need of academic resources, as well those who might find themselves developing an interest for such topics.
        </p>
        <br/>
        <button className= 'btn'> Explore more ! <img src={dark_arrow} alt=""></img> </button>
      </div>
    </div>
  )
}

export default Hero
