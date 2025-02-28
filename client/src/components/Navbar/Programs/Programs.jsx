import React from 'react'
import '../../CSS FOLDER/Programs.css'
import program_1 from '../../../assets/cloud.jpg'
import program_2 from '../../../assets/xielian.jpg'
import program_3 from '../../../assets/eiji.jpg'
import program_icon1 from '../../../assets/book.jpg'
import program_icon2 from '../../../assets/stack.jpg'
import program_icon3 from '../../../assets/flowers.jpg'
import placeholder from '../../../assets/placeholder.png'

const Programs = () => {
  return (
    <div className= 'programs'>
      <div className="program">
        <img src={placeholder} alt="" />
        <div className="caption">
            <img src={program_icon1} alt=""/>
            <p> Journal? </p>
        </div>
      </div>
      <div className="program">
        <img src={placeholder} alt="" />
        <div className="caption">
            <img src={program_icon2} alt=""/>
            <p> Books? </p>
        </div>
      </div>
      <div className="program">
        <img src={placeholder} alt="" />
        <div className="caption">
            <img src={program_icon3} alt=""/>
            <p> Flowers? </p>
        </div>
      </div>
    </div>
  )
}

export default Programs
