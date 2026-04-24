# 🧠 ML-Based CPU Scheduling

> **A machine-learning approach to CPU process scheduling — predict burst times, schedule smarter.**

Traditional CPU schedulers rely on fixed rules that can't adapt to changing workloads. This project trains a **RandomForest** model to **predict CPU burst times** and uses those predictions to make scheduling decisions — like SJF, but without needing to know burst times in advance.

It ships with **six scheduling algorithms**, a **Python backend** for training and benchmarking, and a **fully interactive browser-based simulator** so you can visualise results instantly.

---

## ✨ Features

| Category | Details |
|---|---|
| **Classic Algorithms** | FCFS · SJF · Round Robin · Priority · SRTF |
| **ML Scheduler** | RandomForestRegressor predicts burst → sorts like SJF |
| **Visualisation (Python)** | Matplotlib bar charts & Gantt diagrams |
| **Interactive Frontend** | Browser simulator with configurable process count, time quantum, live bar charts, and Gantt charts — no backend required |
| **Performance Metrics** | Average Waiting Time (WT) and Turnaround Time (TAT) for every algorithm |

---

## 📐 Project Structure

```
ML-based-CPU-Scheduling/
├── main.py                  # Entry point — runs all schedulers & plots results
├── requirements.txt         # Python dependencies
│
├── schedulers/              # Scheduling algorithm implementations
│   ├── fcfs.py              # First Come First Serve
│   ├── sjf.py               # Shortest Job First
│   ├── round_robin.py       # Round Robin (configurable quantum)
│   ├── priority.py          # Priority Scheduling
│   ├── srtf.py              # Shortest Remaining Time First
│   └── ml_scheduler.py      # ML-based scheduler (uses trained model)
│
├── models/
│   ├── train_model.py       # Trains the RandomForest model
│   └── model.pkl            # Pre-trained model (serialised with pickle)
│
├── utils/
│   ├── process_generator.py # Generates random process workloads
│   └── metrics.py           # Metric helpers
│
├── data/
│   ├── generated_data.py    # Data generation script
│   └── raw_data.csv         # Sample dataset
│
├── results/
│   ├── graphs.py            # Bar chart comparison (WT / TAT)
│   ├── gantt.py             # Gantt chart rendering (standard + preemptive)
│   └── output_plots/        # Saved PNG plots
│       ├── waiting_time.png
│       └── turnaround_time.png
│
└── frontend/                # Standalone browser simulator (no server needed)
    ├── index.html
    ├── styles.css
    ├── scheduler.js          # Pure-JS re-implementation of all 6 algorithms
    └── app.js                # UI logic, canvas charts, Gantt rendering
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- `pip` (Python package manager)
- A modern browser (for the frontend simulator)

### 1 · Install dependencies

```bash
pip install -r requirements.txt
```

### 2 · Train the ML model

```bash
python -m models.train_model
```

This generates 100 random processes, trains a **RandomForestRegressor** on `arrival_time → burst_time`, and saves the model to `models/model.pkl`.

### 3 · Run the scheduler comparison

```bash
python main.py
```

**Output:**
- Prints average WT and TAT for each algorithm to the console
- Displays Matplotlib bar charts and Gantt diagrams
- Saves comparison plots to `results/output_plots/`

### 4 · Launch the interactive frontend

Simply open `frontend/index.html` in your browser — **no server required**.

```bash
# or use a quick local server
python -m http.server 8000 -d frontend
# then visit http://localhost:8000
```

---

## 🔬 How It Works

```
┌─────────────────────┐
│  Generate Processes  │  Random arrival_time, burst_time, priority
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Train / Load Model  │  RandomForestRegressor (scikit-learn)
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Predict Burst Time  │  model.predict(arrival_time) → predicted_burst
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Schedule Processes  │  Sort by predicted_burst (SJF-style)
└────────┬────────────┘     Execute using actual burst times
         ▼
┌─────────────────────┐
│  Compare & Visualise │  WT / TAT bar charts + Gantt diagrams
└─────────────────────┘
```

The ML scheduler **predicts** burst times using only `arrival_time` as a feature, then schedules processes in ascending order of predicted burst — identical logic to SJF, but without ground-truth burst information. Execution still uses the **real** burst times, so the comparison is fair.

---

## 📊 Algorithms at a Glance

| Algorithm | Type | Strategy |
|---|---|---|
| **FCFS** | Non-preemptive | Run processes in arrival order |
| **SJF** | Non-preemptive | Pick the process with the smallest burst time |
| **Round Robin** | Preemptive | Fixed time quantum, cyclic execution |
| **Priority** | Non-preemptive | Lower priority number → higher precedence |
| **SRTF** | Preemptive | Preempt if a new arrival has shorter remaining time |
| **ML-Based** | Non-preemptive | Predict burst with RandomForest, then schedule like SJF |

---

## 🖥️ Frontend Simulator

The `frontend/` directory contains a **standalone, zero-dependency web app** that re-implements all six algorithms in pure JavaScript. Features include:

- **Configurable** process count and Round Robin time quantum
- **Process table** showing generated PID, arrival, burst, and priority values
- **Results cards** with average WT and TAT per algorithm
- **Canvas bar charts** comparing waiting time and turnaround time
- **Interactive Gantt charts** with tab-based algorithm switching
- **Dark-themed, responsive UI** built with vanilla CSS and Google Fonts (Inter)

> The ML scheduler in the frontend simulates burst prediction by adding ±3 noise to the actual burst time, replicating model inaccuracy without requiring a Python backend.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python · scikit-learn · Pandas · NumPy · Matplotlib |
| **ML Model** | RandomForestRegressor (scikit-learn) |
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript · Canvas API |
| **Fonts** | Inter (Google Fonts) |

---

## 📈 Sample Output

After running `python main.py`, you'll see output similar to:

```
FCFS     -> WT: 32.40, TAT: 43.10
SJF      -> WT: 18.50, TAT: 29.20
Round Robin -> WT: 28.70, TAT: 39.40
ML       -> WT: 20.10, TAT: 30.80
Priority -> WT: 25.60, TAT: 36.30
SRTF     -> WT: 16.90, TAT: 27.60
```

*Values vary per run since processes are randomly generated.*

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Operating Systems × Machine Learning
</p>