import matplotlib.pyplot as plt

def plot_comparison(results):
    algorithms = list(results.keys())
    waiting_times = [results[a]["wt"] for a in algorithms]
    turnaround_times = [results[a]["tat"] for a in algorithms]

    # Waiting Time Graph
    plt.figure(figsize=(8, 5))
    plt.bar(algorithms, waiting_times, color='skyblue')
    plt.title("Average Waiting Time Comparison")
    plt.ylabel("Time")
    plt.savefig("results/output_plots/waiting_time.png")
    plt.show()

    # Turnaround Time Graph
    plt.figure(figsize=(8, 5))
    plt.bar(algorithms, turnaround_times, color='orange')
    plt.title("Average Turnaround Time Comparison")
    plt.ylabel("Time")
    plt.savefig("results/output_plots/turnaround_time.png")
    plt.show()