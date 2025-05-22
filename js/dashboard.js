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
  
  fetch('trades.json')
  .then(response => response.json())
  .then(trades => {
    const tbody = document.querySelector('#trade-table tbody');
    trades.forEach(trade => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trade.trade_id}</td>
        <td>${new Date(trade.timestamp * 1000).toLocaleString()}</td>
        <td>${trade.type}</td>
        <td>${trade.price}</td>
        <td>${trade.amount}</td>
        <td>${trade.status}</td>
        <td>${trade.profit !== null ? trade.profit : 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
  });


  fetch('trades.json')
  .then(response => response.json())
  .then(trades => {
    // Assuming you have your chart instance as 'priceChart'
    trades.forEach(trade => {
      const annotation = {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: new Date(trade.timestamp * 1000),
        borderColor: trade.type === 'buy' ? 'green' : 'red',
        borderWidth: 2,
        label: {
          content: `${trade.type.toUpperCase()} @ ${trade.price}`,
          enabled: true,
          position: 'top'
        }
      };
      priceChart.options.annotation.annotations.push(annotation);
    });
    priceChart.update();
  });



  setInterval(() => {
    location.reload(); // refresh the page every 5 minutes
  }, 5 * 60 * 1000);
// This will reload the page every 5 minutes  