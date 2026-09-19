"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const DEFAULT_SENTIMENT = [
  { name: "Positive", value: 6, color: "#22c55e" },
  { name: "Neutral", value: 4, color: "#eab308" },
  { name: "Negative", value: 2, color: "#ef4444" },
];

const DEFAULT_THEMES = [
  { theme: "UI Bug", count: 5 },
  { theme: "Performance", count: 4 },
  { theme: "Pricing", count: 2 },
  { theme: "Feature Request", count: 1 },
];

export function FeedbackVolumeChart({ data }: { data?: any }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { date: "Sep 15", count: 1 },
          { date: "Sep 18", count: 3 },
          { date: "Sep 19", count: 8 },
        ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip />
        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SentimentChart({ data }: { data?: any }) {
  const sData = data && data.length > 0 ? data : DEFAULT_SENTIMENT;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={sData}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={4}
          dataKey="value"
        >
          {sData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopThemesChart({ data }: { data?: any }) {
  const tData = data && data.length > 0 ? data : DEFAULT_THEMES;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={tData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="theme"
          type="category"
          width={100}
          tick={{ fontSize: 12, fill: "#475569" }}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}