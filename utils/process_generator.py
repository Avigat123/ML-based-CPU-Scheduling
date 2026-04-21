import random
import pandas as pd

def generate_processes(n=10):
    processes = []

    for i in range(n):
        process = {
            "pid": i + 1,
            "arrival_time": random.randint(0, 10),
            "burst_time": random.randint(1, 20),
            "priority": random.randint(1, 5)
        }
        processes.append(process)

    df = pd.DataFrame(processes)
    return df


if __name__ == "__main__":
    df = generate_processes(10)
    print(df)