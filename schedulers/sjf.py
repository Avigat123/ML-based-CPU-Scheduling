def sjf_scheduling(df):
    df = df.copy()
    df = df.sort_values(by="arrival_time")

    completed = []
    current_time = 0
    waiting_times = {}
    turnaround_times = {}

    processes = df.to_dict("records")

    while processes:
        available = [p for p in processes if p["arrival_time"] <= current_time]

        if not available:
            current_time += 1
            continue

        # pick process with smallest burst time
        shortest = min(available, key=lambda x: x["burst_time"])

        arrival = shortest["arrival_time"]
        burst = shortest["burst_time"]
        pid = shortest["pid"]

        waiting_time = current_time - arrival
        turnaround_time = waiting_time + burst

        current_time += burst

        waiting_times[pid] = waiting_time
        turnaround_times[pid] = turnaround_time

        completed.append(shortest)
        processes.remove(shortest)

    df["waiting_time"] = df["pid"].map(waiting_times)
    df["turnaround_time"] = df["pid"].map(turnaround_times)

    avg_wt = sum(waiting_times.values()) / len(waiting_times)
    avg_tat = sum(turnaround_times.values()) / len(turnaround_times)

    return df, avg_wt, avg_tat