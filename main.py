from utils.process_generator import generate_processes
from schedulers.fcfs import fcfs_scheduling
from schedulers.sjf import sjf_scheduling
from schedulers.round_robin import round_robin_scheduling
from schedulers.ml_scheduler import ml_scheduler
from results.graphs import plot_comparison

# Generate processes
df = generate_processes(10)

# Run all schedulers
_, fcfs_wt, fcfs_tat = fcfs_scheduling(df)
_, sjf_wt, sjf_tat = sjf_scheduling(df)
_, rr_wt, rr_tat = round_robin_scheduling(df)
_, ml_wt, ml_tat = ml_scheduler(df)

# Store results
results = {
    "FCFS": {"wt": fcfs_wt, "tat": fcfs_tat},
    "SJF": {"wt": sjf_wt, "tat": sjf_tat},
    "Round Robin": {"wt": rr_wt, "tat": rr_tat},
    "ML": {"wt": ml_wt, "tat": ml_tat},
}

# Print results
for algo, values in results.items():
    print(f"{algo} -> WT: {values['wt']:.2f}, TAT: {values['tat']:.2f}")

# Plot graphs
plot_comparison(results)