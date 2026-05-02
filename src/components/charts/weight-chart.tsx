"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type WeightData = {
  date: string;
  weight: number;
};

export function WeightChart({ data }: { data: WeightData[] }) {
  return (
    <div className="h-60 min-h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fill: "#667085", fontSize: 12 }} />
          <YAxis tick={{ fill: "#667085", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e4d6da",
              backgroundColor: "#fffaf6",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#cc6f90"
            strokeWidth={3}
            dot={{ r: 4, fill: "#cc6f90" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
