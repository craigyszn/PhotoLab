import React from 'react'


export default function Admin(){
return (
<div>
<h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="bg-white p-4 rounded shadow">Manage Users</div>
<div className="bg-white p-4 rounded shadow">Assign Photographers</div>
</div>
</div>
)
}