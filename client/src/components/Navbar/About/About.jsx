import React from 'react'
import '../../CSS FOLDER/About.css'
import about_img from '../../../assets/hyuna.jpg'
import play_icon from '../../../assets/play-button.png'

const About = () => {
  return (
    <div className='about'>
      <div className="about-left">
        <img src={about_img} alt="" className='about-img'/>
        <img src={play_icon} alt="" className='play-icon' />
      </div>
      <div className="about-right">
       <h3> ABOUT THEM </h3>
       <h2> HERE YOU GO! </h2>
       <p> filler filler filler filler </p>
      </div>
    </div>
  )
}

export default About

