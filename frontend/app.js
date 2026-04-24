
(function () {
    'use strict';

    // Color palette for process blocks (distinct, muted, no purple/blue combos)
    const PROCESS_COLORS = [
        '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
        '#f97316', '#84cc16', '#ec4899', '#14b8a6', '#a855f7',
        '#e11d48', '#0ea5e9', '#65a30d', '#d946ef', '#f43f5e',
        '#10b981', '#eab308', '#6366f1', '#22d3ee', '#fb923c',
        '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', '#0891b2',
        '#ea580c', '#4ade80', '#db2777', '#2dd4bf', '#a78bfa',
    ];

    const ACCENT = '#0d9488';
    const MUTED = '#d4d4d4';

    let currentResults = null;
    let currentProcesses = null;
    let currentQuantum = 2;

    // --- Init ---
    document.getElementById('run-sim-btn').addEventListener('click', runSimulation);

    function runSimulation() {
        const n = parseInt(document.getElementById('process-count').value, 10) || 8;
        const q = parseInt(document.getElementById('time-quantum').value, 10) || 2;
        currentQuantum = q;

        // Generate processes
        currentProcesses = generateProcesses(n);

        // Run all schedulers
        const fcfs = fcfsScheduling(currentProcesses);
        const sjf = sjfScheduling(currentProcesses);
        const rr = roundRobinScheduling(currentProcesses, q);
        const priority = priorityScheduling(currentProcesses);
        const srtf = srtfScheduling(currentProcesses);
        const ml = mlScheduling(currentProcesses);

        currentResults = {
            'FCFS': fcfs,
            'SJF': sjf,
            'Round Robin': rr,
            'Priority': priority,
            'SRTF': srtf,
            'ML-Based': ml,
        };

        // Show sections FIRST so containers have dimensions for chart rendering
        document.getElementById('process-table-section').style.display = '';
        document.getElementById('results-section').style.display = '';
        document.getElementById('charts-section').style.display = '';
        document.getElementById('gantt-section').style.display = '';

        renderProcessTable();
        renderResultCards();

        // Defer chart rendering to next frame so layout is computed
        requestAnimationFrame(() => {
            renderBarCharts();
            renderGanttTabs();
        });
    }

    // --- Process Table ---
    function renderProcessTable() {
        const tbody = document.querySelector('#process-table tbody');
        tbody.innerHTML = '';
        for (const p of currentProcesses) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>P${p.pid}</td>
                <td>${p.arrival_time}</td>
                <td>${p.burst_time}</td>
                <td>${p.priority}</td>
            `;
            tbody.appendChild(row);
        }
    }

    // --- Result Cards ---
    function renderResultCards() {
        const grid = document.getElementById('results-grid');
        grid.innerHTML = '';

        const entries = Object.entries(currentResults);
        const bestWt = Math.min(...entries.map(([, r]) => r.avgWt));
        const bestTat = Math.min(...entries.map(([, r]) => r.avgTat));

        for (const [name, result] of entries) {
            const isBestWt = Math.abs(result.avgWt - bestWt) < 0.01;
            const isBestTat = Math.abs(result.avgTat - bestTat) < 0.01;
            const isBest = isBestWt || isBestTat;

            const card = document.createElement('div');
            card.className = 'result-card' + (isBest ? ' best' : '');
            card.innerHTML = `
                <h4>
                    ${name}
                    ${isBest ? '<span class="best-tag">Best</span>' : ''}
                </h4>
                <div class="result-metric">
                    <span>Avg Wait</span>
                    <span>${result.avgWt.toFixed(2)}</span>
                </div>
                <div class="result-metric">
                    <span>Avg Turnaround</span>
                    <span>${result.avgTat.toFixed(2)}</span>
                </div>
            `;
            grid.appendChild(card);
        }
    }

    // --- Bar Charts (Pure Canvas) ---
    function renderBarCharts() {
        drawBarChart('wt-chart', currentResults, 'avgWt');
        drawBarChart('tat-chart', currentResults, 'avgTat');
    }

    // Short labels for chart X-axis
    const SHORT_NAMES = {
        'FCFS': 'FCFS',
        'SJF': 'SJF',
        'Round Robin': 'RR',
        'Priority': 'Priority',
        'SRTF': 'SRTF',
        'ML-Based': 'ML',
    };

    function drawBarChart(canvasId, results, metric) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Reset canvas size first so it doesn't affect container measurement
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        const containerStyle = getComputedStyle(container);
        const padLeft = parseFloat(containerStyle.paddingLeft) || 0;
        const padRight = parseFloat(containerStyle.paddingRight) || 0;
        const width = Math.floor(containerRect.width - padLeft - padRight);
        const height = 280;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        ctx.clearRect(0, 0, width, height);

        const entries = Object.entries(results);
        const values = entries.map(([, r]) => r[metric]);
        const maxVal = Math.max(...values) * 1.2;
        const bestVal = Math.min(...values);

        const paddingLeft = 50;
        const paddingBottom = 50;
        const paddingTop = 24;
        const paddingRight = 20;
        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingBottom - paddingTop;
        const barWidth = Math.min(52, (chartWidth / entries.length) * 0.55);
        const gap = chartWidth / entries.length;

        // Grid lines
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = paddingTop + (chartHeight / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            const val = maxVal - (maxVal / gridLines) * i;
            ctx.fillStyle = '#8a8a8a';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(val.toFixed(1), paddingLeft - 8, y + 4);
        }

        // Bars
        for (let i = 0; i < entries.length; i++) {
            const [name, result] = entries[i];
            const val = result[metric];
            const barHeight = (val / maxVal) * chartHeight;
            const x = paddingLeft + gap * i + (gap - barWidth) / 2;
            const y = paddingTop + chartHeight - barHeight;

            const isBest = Math.abs(val - bestVal) < 0.01;
            ctx.fillStyle = isBest ? ACCENT : MUTED;

            // Draw bar with slight rounded top
            roundedRect(ctx, x, y, barWidth, barHeight, 3);
            ctx.fill();

            // Value on top
            ctx.fillStyle = isBest ? ACCENT : '#525252';
            ctx.font = '600 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(val.toFixed(1), x + barWidth / 2, y - 8);

            // Label at bottom — use short name
            const label = SHORT_NAMES[name] || name;
            ctx.fillStyle = '#525252';
            ctx.font = '500 12px Inter, sans-serif';
            ctx.fillText(label, x + barWidth / 2, paddingTop + chartHeight + 24);
        }
    }

    function roundedRect(ctx, x, y, w, h, r) {
        r = Math.min(r, h / 2, w / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // --- Gantt Chart ---
    function renderGanttTabs() {
        const container = document.getElementById('gantt-tabs');
        container.innerHTML = '';

        const names = Object.keys(currentResults);
        names.forEach((name, i) => {
            const btn = document.createElement('button');
            btn.className = 'gantt-tab' + (i === 0 ? ' active' : '');
            btn.textContent = name;
            btn.addEventListener('click', () => {
                container.querySelectorAll('.gantt-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                drawGantt(name);
            });
            container.appendChild(btn);
        });

        drawGantt(names[0]);
    }

    function drawGantt(algoName) {
        const canvas = document.getElementById('gantt-chart');
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const gantt = currentResults[algoName].gantt;
        if (!gantt || gantt.length === 0) return;

        const totalTime = Math.max(...gantt.map(g => g.end));

        // Reset canvas size so it doesn't affect container measurement
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        const wrapEl = canvas.parentElement;
        const wrapRect = wrapEl.getBoundingClientRect();
        const wrapStyle = getComputedStyle(wrapEl);
        const wPadLeft = parseFloat(wrapStyle.paddingLeft) || 0;
        const wPadRight = parseFloat(wrapStyle.paddingRight) || 0;
        const containerWidth = Math.floor(wrapRect.width - wPadLeft - wPadRight);
        const width = Math.max(containerWidth, totalTime * 30);
        const height = 100;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        ctx.clearRect(0, 0, width, height);

        const paddingLeft = 10;
        const barY = 20;
        const barHeight = 40;
        const chartWidth = width - paddingLeft * 2;
        const scale = chartWidth / totalTime;

        for (const block of gantt) {
            const x = paddingLeft + block.start * scale;
            const w = (block.end - block.start) * scale;
            const colorIdx = (block.pid - 1) % PROCESS_COLORS.length;

            ctx.fillStyle = PROCESS_COLORS[colorIdx];
            roundedRect(ctx, x, barY, Math.max(w - 1, 2), barHeight, 3);
            ctx.fill();

            // Process label
            if (w > 20) {
                ctx.fillStyle = '#fff';
                ctx.font = '600 11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`P${block.pid}`, x + w / 2, barY + barHeight / 2 + 4);
            }
        }

        // Time markers
        ctx.fillStyle = '#8a8a8a';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        const step = totalTime <= 20 ? 1 : totalTime <= 50 ? 2 : 5;
        for (let t = 0; t <= totalTime; t += step) {
            const x = paddingLeft + t * scale;
            ctx.fillText(t, x, barY + barHeight + 16);

            // Tick mark
            ctx.strokeStyle = '#d4d4d4';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, barY + barHeight);
            ctx.lineTo(x, barY + barHeight + 4);
            ctx.stroke();
        }
    }

    // Handle window resize for charts
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (currentResults) {
                renderBarCharts();
                const activeTab = document.querySelector('.gantt-tab.active');
                if (activeTab) drawGantt(activeTab.textContent);
            }
        }, 200);
    });
})();
