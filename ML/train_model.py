import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Load training data
X_path = os.path.join(os.path.dirname(__file__), "data/X.npy")
y_path = os.path.join(os.path.dirname(__file__), "data/y.npy")
X = np.load(X_path)
y = np.load(y_path)

# Train model
model = RandomForestRegressor()
model.fit(X, y)

# Save model
model_path = os.path.join(os.path.dirname(__file__), "team_quality_model.joblib")
joblib.dump(model, model_path)
print(f"Model trained and saved to {model_path}") 