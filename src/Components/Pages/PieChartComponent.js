import React, {useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Teal
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#A28EFF', // Light Purple
  '#FF6666', // Soft Red
  '#66CC99', // Mint Green
  '#FFCC00', // Bright Yellow
  '#3366FF', // Royal Blue
  '#FF99CC', // Pink
];


const PieChartComponent = ({data}) => {

  const chartData = useMemo(() => {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [data]);
  // console.log(chartData);
  return (
    <div style={{ width: '100%', height: '400px', maxWidth: '600px', margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            iconSize={10}
            wrapperStyle={{
              backgroundColor: '#fff',
              border: '2px solid #d5d5d5',
              borderRadius: 5,
              lineHeight: '40px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;