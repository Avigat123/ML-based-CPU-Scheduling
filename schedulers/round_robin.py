def round_robin_scheduling(df, time_quantum=2):
    df = df.sort_values(by="arrival_time").copy()

    remaining_burst = {row["pid"]: row["burst_time"] for _, row in df.iterrows()}
    arrival_times = {row["pid"]: row["arrival_time"] for _, row in df.iterrows()}

    current_time = 0
    queue = []
    completed = set()
    gantt_chart = []

    waiting_times = {pid: 0 for pid in remaining_burst}
    last_executed = {pid: 0 for pid in remaining_burst}

    processes = df.to_dict("records")

    while len(completed) < len(processes):

        # Add arrived processes to queue
        for p in processes:
            if p["arrival_time"] <= current_time and p["pid"] not in queue and p["pid"] not in completed:
                queue.append(p["pid"])

        if not queue:
            current_time += 1
            continue

        pid = queue.pop(0)

        # Waiting time update
        waiting_times[pid] += current_time - last_executed[pid]

        exec_time = min(time_quantum, remaining_burst[pid])
        gantt_chart.append((pid, current_time))
        remaining_burst[pid] -= exec_time
        current_time += exec_time

        last_executed[pid] = current_time

        # Add new arrivals during execution
        for p in processes:
            if p["arrival_time"] <= current_time and p["pid"] not in queue and p["pid"] not in completed and p["pid"] != pid:
                queue.append(p["pid"])

        if remaining_burst[pid] > 0:
            queue.append(pid)
        else:
            completed.add(pid)

    turnaround_times = {
        pid: waiting_times[pid] + df[df["pid"] == pid]["burst_time"].values[0]
        for pid in waiting_times
    }

    df["waiting_time"] = df["pid"].map(waiting_times)
    df["turnaround_time"] = df["pid"].map(turnaround_times)

    avg_wt = sum(waiting_times.values()) / len(waiting_times)
    avg_tat = sum(turnaround_times.values()) / len(turnaround_times)

    return df, avg_wt, avg_tat, gantt_chart