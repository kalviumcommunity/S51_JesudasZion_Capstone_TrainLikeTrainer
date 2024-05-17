import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'

function CoursePositions() {
    const {name} = useParams()
    const [toggledPos, setToggledPos] = useState(null) // State for toggled position
    const [data, setData] = useState([])

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

    const handleToggle = (posName) => {
        setToggledPos(prevPos => prevPos === posName ? null : posName)
    }

    return (
        <>
            <NavBar />
            <div id='sports_container'>
                {data && data.map((pos, index) => (
                    <div key={index}>
                        <div onClick={() => handleToggle(pos.name)} className="sports_tab">
                            <img src="" alt="" />
                            <div>
                                <p>{pos.name}</p>
                            </div>
                        </div>
                        {toggledPos === pos.name && (
                            <div>
                                {pos.characteristics.map((item, index) => (
                                    <div key={index}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default CoursePositions
