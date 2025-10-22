import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'


export default function ServicesPreview(){
    const [services, setServices] = useState([])
    useEffect(()=>{
    api.get('/services')
    .then(res=> setServices(res.data))
    .catch(()=>{
    // fallback sample data
    setServices([
    {id:1, title:'Portrait Session', price:120, duration:'1 hr'},
    {id:2, title:'Event Coverage', price:450, duration:'4 hrs'},
    {id:3, title:'Product Shoot', price:200, duration:'2 hrs'}
    ])
    })
    },[])


    return (
    <section>
    <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold">Popular Packages</h2>
    <Link to="/services" className="text-sm text-purple-600">View all</Link>
    </div>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.map(s=> (
    <div key={s.id} className="bg-white p-4 rounded shadow-sm">
    <div className="font-semibold">{s.title}</div>
    <div className="text-sm text-gray-500 mt-1">{s.duration}</div>
    <div className="mt-3 flex items-center justify-between">
    <div className="text-lg font-bold">${s.price}</div>
    <Link to="/booking" className="px-3 py-1 bg-purple-600 text-white rounded">Book</Link>
    </div>
    </div>
    ))}
    </div>
    </section>
)
}