# 🚀 ML-Based CPU Scheduling

An intelligent CPU scheduling system that integrates **Machine Learning with Operating Systems** to improve scheduling efficiency and system performance.

---

## 📌 Overview
Traditional CPU scheduling algorithms such as **FCFS, SJF, and Round Robin** rely on fixed rules and fail to adapt to dynamic workloads.  
This project introduces a **Machine Learning-based scheduler** that predicts CPU burst time and makes smarter, adaptive scheduling decisions.

---

## ⚡ Features
- 🧮 Implementation of classic scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin (RR)
- 🤖 ML-based Scheduler using burst time prediction
- 📊 Performance comparison using:
  - Average Waiting Time
  - Turnaround Time
- 📈 Graphical visualization of results

---

## 🧠 Core Idea
In real-world systems, the OS does not know the exact CPU burst time of a process.  
This project uses a **Machine Learning model** to predict burst time and improve scheduling decisions dynamically.

---

## 🛠️ Tech Stack
- Python  
- scikit-learn  
- NumPy, Pandas  
- Matplotlib  

---

## 📊 Results
The ML-based scheduler demonstrates **improved performance** over traditional algorithms:
- Reduced waiting time  
- Better turnaround time  
- Smarter scheduling decisions  

---

## ▶️ How to Run

```bash
# Train the model
python -m models.train_model

# Run the scheduler comparison
python main.py