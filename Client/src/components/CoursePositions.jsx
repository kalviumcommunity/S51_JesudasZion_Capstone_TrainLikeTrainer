import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'



function CoursePositions() {
    const {name} = useParams()

    const [data ,setData] = useState([])

    const fetch = async() =>{
        try{
            const response = await axios.get(`http://localhost:3000/sports/${name}`)
            setData(response.data.positions)
            console.log(response)
        }catch(err){
            console.error(err)
        }
    }
    
    useEffect(()=>{
        fetch()
    },[])
  return (
    <>
    <NavBar></NavBar>
        <div id='sports_constainer'>
        {data && data.map((pos,index)=>{
           return ( 
            <Link to={`/course/Football${pos.name}`} key={index}>
            <div className="sports_tab">
              <img src="" alt="" />
              <div>
                <p>{pos.name}</p>
              </div>
            </div>
          </Link>
           )
        })
        }
        </div>
    </>
  )
}

export default CoursePositions