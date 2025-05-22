// Declare chart globally to access it later
let priceChart;

async function loadChart() {
  const res = await fetch('ohlc.json');
  const data = await res.json();

  const timestamps = data.map(d => new Date(d[0] * 1000).toLocaleTimeString());
  const prices = data.map(d => parseFloat(d[4])); // close price

  const ctx = document.getElementById('priceChart');

  priceChart = new Chart(ctx, {
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
        legend: { labels: { color: '#fff' } },
        annotation: {
          annotations: []
        }
      },
      scales: {
        x: {
          ticks: { color: '#aaa' },
          title: { display: true, text: 'Time', color: '#fff' }
        },
        y: {
          ticks: { color: '#aaa' },
          title: { display: true, text: 'Price (USD)', color: '#fff' }
        }
      }
    }
  });
}

async function loadAndRender() {
  await loadChart();

  // Load trades and render table + annotations
  fetch('trades.json')
    .then(response => response.json())
    .then(trades => {
      const tbody = document.querySelector('#trade-table tbody');
      tbody.innerHTML = ''; // Clear old rows if any

      trades.forEach(trade => {
        // Trade history table
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

        // Chart annotation (marker)
        priceChart.options.plugins.annotation.annotations.push({
          type: 'line',
          mode: 'vertical',
          scaleID: 'x',
          value: new Date(trade.timestamp * 1000).toLocaleTimeString(),
          borderColor: trade.type === 'buy' ? 'green' : 'red',
          borderWidth: 2,
          label: {
            enabled: true,
            content: `${trade.type.toUpperCase()} @ ${trade.price}`,
            position: 'start',
            color: '#fff',
            backgroundColor: trade.type === 'buy' ? 'green' : 'red'
          }
        });
      });

      priceChart.update();
    });
}

// Initial load
loadAndRender();

// Refresh the page every 5 minutes to keep data current
setInterval(() => {
  location.reload();
}, 5 * 60 * 1000);
