def fcfs_scheduling(df):
    df = df.sort_values(by="arrival_time").copy()

    current_time = 0
    waiting_times = []
    turnaround_times = []

    for index, row in df.iterrows():
        arrival = row["arrival_time"]
        burst = row["burst_time"]

        if current_time < arrival:
            current_time = arrival

        waiting_time = current_time - arrival
        turnaround_time = waiting_time + burst

        current_time += burst

        waiting_times.append(waiting_time)
        turnaround_times.append(turnaround_time)

    df["waiting_time"] = waiting_times
    df["turnaround_time"] = turnaround_times

    avg_wt = sum(waiting_times) / len(waiting_times)
    avg_tat = sum(turnaround_times) / len(turnaround_times)

    return df, avg_wt, avg_tat