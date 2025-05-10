"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan 1",
    views: 400,
    engagement: 240,
  },
  {
    name: "Jan 5",
    views: 300,
    engagement: 139,
  },
  {
    name: "Jan 10",
    views: 200,
    engagement: 980,
  },
  {
    name: "Jan 15",
    views: 278,
    engagement: 390,
  },
  {
    name: "Jan 20",
    views: 189,
    engagement: 480,
  },
  {
    name: "Jan 25",
    views: 239,
    engagement: 380,
  },
  {
    name: "Jan 30",
    views: 349,
    engagement: 430,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="views" fill="#000000" radius={[4, 4, 0, 0]} />
        <Bar dataKey="engagement" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
