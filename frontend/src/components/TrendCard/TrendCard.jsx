import React from 'react'
import './TrendCard.css'
import { TrendData } from '../../Data/TrendData'

function TrendCard() {
  return (
    <div className="TrendCard">
        <h5>Trends for you</h5>
        {TrendData.map((trend)=>{
            return(
                <div className="trend" key={trend.name}>
                    <span>#{trend.name}</span>
                    <span>#{trend.shares}k shares</span>
                </div>
            )
        })}
    </div>
  )
}

export default TrendCard
