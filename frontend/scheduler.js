
// --- Process Generator ---
function generateProcesses(n) {
    const processes = [];
    for (let i = 0; i < n; i++) {
        processes.push({
            pid: i + 1,
            arrival_time: Math.floor(Math.random() * 11),      // 0..10
            burst_time: Math.floor(Math.random() * 20) + 1,    // 1..20
            priority: Math.floor(Math.random() * 5) + 1,       // 1..5
        });
    }
    return processes;
}

// --- FCFS ---
function fcfsScheduling(processes) {
    const procs = processes.map(p => ({ ...p }));
    procs.sort((a, b) => a.arrival_time - b.arrival_time);

    let currentTime = 0;
    const order = [];

    for (const p of procs) {
        if (currentTime < p.arrival_time) currentTime = p.arrival_time;
        p.waiting_time = currentTime - p.arrival_time;
        p.turnaround_time = p.waiting_time + p.burst_time;
        order.push({ pid: p.pid, start: currentTime, end: currentTime + p.burst_time });
        currentTime += p.burst_time;
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    return { procs, avgWt, avgTat, gantt: order };
}

// --- SJF ---
function sjfScheduling(processes) {
    const procs = processes.map(p => ({ ...p }));
    const remaining = [...procs];
    let currentTime = 0;
    const gantt = [];

    while (remaining.length > 0) {
        const available = remaining.filter(p => p.arrival_time <= currentTime);
        if (available.length === 0) {
            currentTime++;
            continue;
        }
        available.sort((a, b) => a.burst_time - b.burst_time);
        const shortest = available[0];

        shortest.waiting_time = currentTime - shortest.arrival_time;
        shortest.turnaround_time = shortest.waiting_time + shortest.burst_time;
        gantt.push({ pid: shortest.pid, start: currentTime, end: currentTime + shortest.burst_time });
        currentTime += shortest.burst_time;

        const idx = remaining.indexOf(shortest);
        remaining.splice(idx, 1);
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    return { procs, avgWt, avgTat, gantt };
}

// --- Round Robin ---
function roundRobinScheduling(processes, quantum = 2) {
    const procs = processes.map(p => ({ ...p }));
    procs.sort((a, b) => a.arrival_time - b.arrival_time);

    const remainingBurst = {};
    const arrivalTimes = {};
    const waitingTimes = {};
    const lastExecuted = {};
    const ganttRaw = [];

    for (const p of procs) {
        remainingBurst[p.pid] = p.burst_time;
        arrivalTimes[p.pid] = p.arrival_time;
        waitingTimes[p.pid] = 0;
        lastExecuted[p.pid] = 0;
    }

    let currentTime = 0;
    const queue = [];
    const completed = new Set();

    while (completed.size < procs.length) {
        // Add arrived processes
        for (const p of procs) {
            if (p.arrival_time <= currentTime && !queue.includes(p.pid) && !completed.has(p.pid)) {
                queue.push(p.pid);
            }
        }

        if (queue.length === 0) {
            currentTime++;
            continue;
        }

        const pid = queue.shift();
        waitingTimes[pid] += currentTime - lastExecuted[pid];

        const execTime = Math.min(quantum, remainingBurst[pid]);
        ganttRaw.push({ pid, start: currentTime, end: currentTime + execTime });
        remainingBurst[pid] -= execTime;
        currentTime += execTime;
        lastExecuted[pid] = currentTime;

        // Add new arrivals during execution
        for (const p of procs) {
            if (p.arrival_time <= currentTime && !queue.includes(p.pid) && !completed.has(p.pid) && p.pid !== pid) {
                queue.push(p.pid);
            }
        }

        if (remainingBurst[pid] > 0) {
            queue.push(pid);
        } else {
            completed.add(pid);
        }
    }

    for (const p of procs) {
        p.waiting_time = waitingTimes[p.pid];
        p.turnaround_time = p.waiting_time + p.burst_time;
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    // Merge adjacent same-pid blocks for display
    const gantt = mergeGantt(ganttRaw);

    return { procs, avgWt, avgTat, gantt };
}

// --- Priority ---
function priorityScheduling(processes) {
    const procs = processes.map(p => ({ ...p }));
    procs.sort((a, b) => a.priority - b.priority || a.arrival_time - b.arrival_time);

    let currentTime = 0;
    const gantt = [];

    for (const p of procs) {
        if (currentTime < p.arrival_time) currentTime = p.arrival_time;
        p.waiting_time = currentTime - p.arrival_time;
        p.turnaround_time = p.waiting_time + p.burst_time;
        gantt.push({ pid: p.pid, start: currentTime, end: currentTime + p.burst_time });
        currentTime += p.burst_time;
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    return { procs, avgWt, avgTat, gantt };
}

// --- SRTF ---
function srtfScheduling(processes) {
    const procs = processes.map(p => ({ ...p }));

    const remaining = {};
    const arrival = {};
    const waitTime = {};
    const lastTime = {};
    const ganttRaw = [];

    for (const p of procs) {
        remaining[p.pid] = p.burst_time;
        arrival[p.pid] = p.arrival_time;
        waitTime[p.pid] = 0;
        lastTime[p.pid] = p.arrival_time;
    }

    let currentTime = 0;
    const completed = new Set();

    while (completed.size < procs.length) {
        const available = procs.filter(p => p.arrival_time <= currentTime && !completed.has(p.pid));
        if (available.length === 0) {
            currentTime++;
            continue;
        }

        available.sort((a, b) => remaining[a.pid] - remaining[b.pid]);
        const shortest = available[0];
        const pid = shortest.pid;

        waitTime[pid] += currentTime - lastTime[pid];
        ganttRaw.push({ pid, start: currentTime, end: currentTime + 1 });
        remaining[pid] -= 1;
        currentTime += 1;
        lastTime[pid] = currentTime;

        if (remaining[pid] === 0) {
            completed.add(pid);
        }
    }

    for (const p of procs) {
        p.waiting_time = waitTime[p.pid];
        p.turnaround_time = p.waiting_time + p.burst_time;
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    const gantt = mergeGantt(ganttRaw);

    return { procs, avgWt, avgTat, gantt };
}

// --- ML-Based Scheduler (simulated) ---
// Since we can't run a real RandomForest in the browser,
// we simulate the prediction: add noise to the actual burst_time.
// The idea is identical to the Python code — predict burst, sort by it, schedule.
function mlScheduling(processes) {
    const procs = processes.map(p => ({
        ...p,
        predicted_burst: Math.max(1, p.burst_time + (Math.random() * 6 - 3)),  // ±3 noise
    }));

    procs.sort((a, b) => a.arrival_time - b.arrival_time || a.predicted_burst - b.predicted_burst);

    let currentTime = 0;
    const gantt = [];

    for (const p of procs) {
        if (currentTime < p.arrival_time) currentTime = p.arrival_time;
        p.waiting_time = currentTime - p.arrival_time;
        p.turnaround_time = p.waiting_time + p.burst_time;  // actual burst for execution
        gantt.push({ pid: p.pid, start: currentTime, end: currentTime + p.burst_time });
        currentTime += p.burst_time;
    }

    const avgWt = procs.reduce((s, p) => s + p.waiting_time, 0) / procs.length;
    const avgTat = procs.reduce((s, p) => s + p.turnaround_time, 0) / procs.length;

    return { procs, avgWt, avgTat, gantt };
}


// --- Helpers ---
function mergeGantt(raw) {
    if (raw.length === 0) return [];
    const merged = [];
    let current = { ...raw[0] };

    for (let i = 1; i < raw.length; i++) {
        if (raw[i].pid === current.pid && raw[i].start === current.end) {
            current.end = raw[i].end;
        } else {
            merged.push(current);
            current = { ...raw[i] };
        }
    }
    merged.push(current);
    return merged;
}
