import React from 'react'


export default function GalleryPreview(){
const images = new Array(6).fill(0).map((_,i)=>`/images/sample-${i+1}.jpg`)
return (
<section>
<div className="flex items-center justify-between">
<h2 className="text-2xl font-semibold">Portfolio</h2>
<a href="/gallery" className="text-sm text-purple-600">See gallery</a>
</div>
<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
{images.map((src, idx)=> (
<div key={idx} className="w-full h-40 bg-gray-200 rounded overflow-hidden flex items-end p-2">
<img src={src} alt={`sample ${idx}`} className="object-cover w-full h-full" />
</div>
))}
</div>
</section>
)
}