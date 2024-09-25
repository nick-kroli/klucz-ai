import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HealthScoreChart = ({ score }) => {
  const getGaugeColor = () => {
    if (score >= 80) {
      return '#4CAF50'; // Green
    } else if (score >= 50) {
      return '#FFBB28'; // Yellow
    } else {
      return '#FF6666'; // Red
    }
  };

  const data = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [getGaugeColor(), '#e0e0e0'],
      circumference: 180,
      rotation: 270,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  const plugins = [{
    id: 'healthScoreNeedle',
    afterDraw: (chart) => {
      const { ctx, chartArea, width, height } = chart;
      const xCenter = chartArea.left + (chartArea.right - chartArea.left) / 2;
      const yCenter = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
      const radius = chart.outerRadius;

      // Draw background for score
      ctx.save();
      ctx.beginPath();
      ctx.arc(xCenter, yCenter, radius * 0.7, Math.PI, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.restore();

      // Draw needle
      const needleAngle = Math.PI * (1 - score / 100);
      ctx.save();
      ctx.translate(xCenter, yCenter);
      ctx.rotate(needleAngle);
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(radius - 10, 0);
      ctx.lineTo(0, 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      ctx.restore();

      // Draw score text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(score, xCenter, yCenter - radius * 0.2);

      ctx.font = '16px Arial';
      ctx.fillText('Health Score', xCenter, yCenter + radius * 0.2);
    }
  }];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    }}>
      <div style={{
        width: '220px',
        height: '180px',
        position: 'relative'
      }}>
        <Doughnut data={data} options={options} plugins={plugins} />
      </div>
    </div>
  );
};

const HealthScoreDashboard = () => {
  return (
    <div className='health-score-dashboard' style={{
      height: '400px',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h3 style={{ marginBottom: '20px' }}>Health Overview</h3>
      <HealthScoreChart score={75} />
    </div>
  );
};

export default HealthScoreDashboard;