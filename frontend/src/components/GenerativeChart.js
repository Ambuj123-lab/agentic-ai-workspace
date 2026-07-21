"use client";

import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0EA5E9', '#A855F7', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function GenerativeChart({ config }) {
  if (!config || !config.data || config.data.length === 0) {
    return <div style={{ color: '#ef4444', padding: '10px' }}>Invalid chart data</div>;
  }

  const { chartType = 'bar', title = 'Chart', data, xKey = 'name', yKey = 'value' } = config;

  // Custom styling for Tooltip in dark mode
  const customTooltipStyle = {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px'
  };

  const renderChart = () => {
    switch (chartType.toLowerCase()) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={xKey} stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#0EA5E9' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
            <Line type="monotone" dataKey={yKey} stroke="#0EA5E9" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip contentStyle={customTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey={yKey}
              nameKey={xKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelStyle={{ fontSize: '12px', fill: '#9CA3AF' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={xKey} stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
            <Bar dataKey={yKey} fill="#A855F7" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      marginBottom: '16px',
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {title && (
        <h4 style={{
          margin: '0 0 20px 0',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {title}
        </h4>
      )}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
