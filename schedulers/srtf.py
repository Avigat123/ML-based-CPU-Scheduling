def srtf_scheduling(df):
    df = df.copy()
    processes = df.to_dict("records")

    remaining = {p["pid"]: p["burst_time"] for p in processes}
    arrival = {p["pid"]: p["arrival_time"] for p in processes}
    gantt_chart = []
    current_time = 0
    completed = set()
    waiting_time = {p["pid"]: 0 for p in processes}
    last_time = {p["pid"]: p["arrival_time"] for p in processes}

    while len(completed) < len(processes):

        available = [p for p in processes if p["arrival_time"] <= current_time and p["pid"] not in completed]

        if not available:
            current_time += 1
            continue

        # Pick process with smallest remaining time
        shortest = min(available, key=lambda x: remaining[x["pid"]])
        pid = shortest["pid"]

        waiting_time[pid] += current_time - last_time[pid]

        gantt_chart.append((pid, current_time))
        remaining[pid] -= 1
        current_time += 1
        last_time[pid] = current_time

        if remaining[pid] == 0:
            completed.add(pid)

    turnaround_time = {
        pid: waiting_time[pid] + df[df["pid"] == pid]["burst_time"].values[0]
        for pid in waiting_time
    }

    df["waiting_time"] = df["pid"].map(waiting_time)
    df["turnaround_time"] = df["pid"].map(turnaround_time)

    avg_wt = sum(waiting_time.values()) / len(waiting_time)
    avg_tat = sum(turnaround_time.values()) / len(turnaround_time)

    return df, avg_wt, avg_tat, gantt_chart