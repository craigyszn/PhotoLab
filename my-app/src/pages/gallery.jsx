import React from 'react'


export default function Gallery(){
const images = new Array(12).fill(0).map((_,i)=>`/images/sample-${(i%6)+1}.jpg`)
return (
<div>
<h1 className="text-2xl font-semibold mb-4">Gallery</h1>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
{images.map((src, idx)=> (
<div key={idx} className="w-full h-40 bg-gray-200 rounded overflow-hidden">
<img src={src} alt={`g${idx}`} className="object-cover w-full h-full" />
</div>
))}
</div>
</div>
)
}