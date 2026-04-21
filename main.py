from utils.process_generator import generate_processes
from schedulers.fcfs import fcfs_scheduling
from schedulers.sjf import sjf_scheduling
from schedulers.round_robin import round_robin_scheduling
from schedulers.ml_scheduler import ml_scheduler
from results.graphs import plot_comparison
from schedulers.priority import priority_scheduling
from schedulers.srtf import srtf_scheduling
from results.gantt import plot_gantt, plot_gantt_preemptive

# Generate processes
df = generate_processes(10)

# Run all schedulers
_, fcfs_wt, fcfs_tat, fcfs_order = fcfs_scheduling(df)
_, sjf_wt, sjf_tat = sjf_scheduling(df)
_, rr_wt, rr_tat, rr_chart = round_robin_scheduling(df)
_, ml_wt, ml_tat = ml_scheduler(df)
_, priority_wt, priority_tat = priority_scheduling(df)
_, srtf_wt, srtf_tat, srtf_chart = srtf_scheduling(df)

# Store results
results = {
    "FCFS": {"wt": fcfs_wt, "tat": fcfs_tat},
    "SJF": {"wt": sjf_wt, "tat": sjf_tat},
    "Round Robin": {"wt": rr_wt, "tat": rr_tat},
    "ML": {"wt": ml_wt, "tat": ml_tat},
    "Priority": {"wt": priority_wt, "tat": priority_tat},
    "SRTF": {"wt": srtf_wt, "tat": srtf_tat},
}

# Print results
for algo, values in results.items():
    print(f"{algo} -> WT: {values['wt']:.2f}, TAT: {values['tat']:.2f}")

# Plot graphs
plot_comparison(results)
plot_gantt(fcfs_order)
plot_gantt_preemptive(srtf_chart)
plot_gantt_preemptive(rr_chart)