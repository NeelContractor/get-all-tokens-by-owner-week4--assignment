import React from "react"


export default function Box({name, amount} : {
    name: string,
    amount: number
}) {
    return <div className="border flex justify-between">
        <h2 className="text-3xl">{name}</h2>
        <p className="text-xl">{amount}</p>
    </div>
}