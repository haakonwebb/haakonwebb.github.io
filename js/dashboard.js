async function loadChart() {
    const res = await fetch('ohlc.json');
    const data = await res.json();
  
    const timestamps = data.map(d => new Date(d[0] * 1000).toLocaleTimeString());
    const prices = data.map(d => parseFloat(d[4])); // closing price
  
    new Chart(document.getElementById('priceChart'), {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'SOL/USD Closing Price',
          data: prices,
          borderColor: '#00ff99',
          backgroundColor: 'rgba(0, 255, 153, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#fff' } }
        },
        scales: {
          x: { ticks: { color: '#aaa' } },
          y: { ticks: { color: '#aaa' } }
        }
      }
    });
  }
  
  loadChart();
  

  setInterval(() => {
    location.reload(); // refresh the page every 5 minutes
  }, 5 * 60 * 1000);
// This will reload the page every 5 minutes  