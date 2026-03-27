import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

from utils.process_generator import generate_processes

# Generate dataset
df = generate_processes(100)

# Features (you can expand later)
X = df[["arrival_time"]]
y = df["burst_time"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save model
with open("models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved!")