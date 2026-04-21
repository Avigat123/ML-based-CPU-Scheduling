import matplotlib.pyplot as plt

def plot_gantt(process_order):
    fig, ax = plt.subplots()

    current_time = 0

    for p in process_order:
        pid = p["pid"]
        burst = p["burst_time"]

        ax.barh(0, burst, left=current_time, edgecolor='black')
        ax.text(current_time + burst/2, 0, f"P{pid}", 
                ha='center', va='center', color='black')

        current_time += burst

    ax.set_xlabel("Time")
    ax.set_title("Gantt Chart")
    ax.set_yticks([])

    plt.show()

def plot_gantt_preemptive(gantt_chart):
    fig, ax = plt.subplots()

    merged = []
    prev_pid, start = gantt_chart[0]

    for i in range(1, len(gantt_chart)):
        pid, time = gantt_chart[i]

        if pid != prev_pid:
            merged.append((prev_pid, start, time))
            prev_pid = pid
            start = time

    # last segment
    merged.append((prev_pid, start, gantt_chart[-1][1]))

    # Plot
    for pid, start, end in merged:
        ax.barh(0, end - start, left=start, edgecolor='black')
        ax.text(start + (end - start)/2, 0, f"P{pid}",
                ha='center', va='center')

    ax.set_title("Gantt Chart (Preemptive)")
    ax.set_xlabel("Time")
    ax.set_yticks([])

    plt.show()