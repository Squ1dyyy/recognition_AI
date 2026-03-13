import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image


class CircleDataset:
	def __init__(self, n_samples=500, noise=0.1, factor=0.5, seed=42):
		np.random.seed(seed)
		self.X, self.y = self._generate(n_samples, noise, factor)
		self.X = torch.tensor(self.X, dtype=torch.float32)
		self.y = torch.tensor(self.y, dtype=torch.long)

	def _generate(self, n, noise, factor):
		n_out = n // 2
		n_in = n - n_out

		# Внутренний круг — как раньше
		r_in = factor + noise * np.random.randn(n_in)
		theta_in = 2 * np.pi * np.random.rand(n_in)
		X_in = np.c_[r_in * np.cos(theta_in), r_in * np.sin(theta_in)]
		y_in = np.ones(n_in, dtype=int)

		# Внешний класс — хаотично по всему пространству
		X_out = np.random.uniform(low=-1.5, high=1.5, size=(n_out, 2))
		# Исключаем внутренний круг, чтобы точки не попадали внутрь
		mask = np.linalg.norm(X_out, axis=1) > factor + noise
		X_out = X_out[mask]
		y_out = np.zeros(X_out.shape[0], dtype=int)

		X = np.vstack([X_in, X_out])
		y = np.hstack([y_in, y_out])
		return X, y


class BaseModel(nn.Module):
	def __init__(self):
		super().__init__()
		self.loss_fn = nn.CrossEntropyLoss()

	def train_model(self, X, y, epochs, optimizer):
		for epoch in range(epochs):
			optimizer.zero_grad()
			y_pred = self.forward(X)
			loss = self.loss_fn(y_pred, y)
			loss.backward()
			optimizer.step()

			if (epoch + 1) % (epochs // 5) == 0 or epoch == 0:
				print(f"[{self.__class__.__name__}] Epoch {epoch + 1}/{epochs} | Loss = {loss.item():.4f}")

	def predict_grid(self, grid):
		with torch.no_grad():
			preds = self.forward(grid)
			return torch.argmax(preds, dim=1).numpy()


class Perceptron(BaseModel):
	def __init__(self):
		super().__init__()
		self.linear = nn.Linear(2, 2)

	def forward(self, x):
		return self.linear(x)


class MLP(BaseModel):
	def __init__(self):
		super().__init__()
		self.network = nn.Sequential(
			nn.Linear(2, 8),
			nn.ReLU(),
			nn.Linear(8, 8),
			nn.ReLU(),
			nn.Linear(8, 2)
		)

	def forward(self, x):
		return self.network(x)


class Visualizer:
	def __init__(self, X, y):
		self.X = X
		self.y = y

	def plot_decision_boundary(self, model, title, ax):
		xx, yy = np.meshgrid(np.linspace(-1.6, 1.6, 400), np.linspace(-1.6, 1.6, 400))
		grid = np.c_[xx.ravel(), yy.ravel()]
		grid_tensor = torch.tensor(grid, dtype=torch.float32)

		Z = model.predict_grid(grid_tensor)
		Z = Z.reshape(xx.shape)

		ax.contourf(xx, yy, Z, cmap=plt.cm.coolwarm, alpha=0.3)
		ax.scatter(self.X[:, 0], self.X[:, 1], c=self.y, s=40, cmap=plt.cm.coolwarm, edgecolors='k')
		ax.set_title(title)
		ax.set_xlabel("X₁")
		ax.set_ylabel("X₂")
		ax.set_xlim(-1.6, 1.6)
		ax.set_ylim(-1.6, 1.6)


def main():
	data = CircleDataset(n_samples=500, noise=0.1)
	X, y = data.X, data.y

	perceptron = Perceptron()
	mlp = MLP()
	for name, layer in mlp.named_modules():
		if hasattr(layer, 'weight') and layer.weight is not None:
			shape = tuple(layer.weight.shape)
			print(f"{name:10s} → shape = {shape}")

	exit(1)
	perceptron.train_model(X, y, epochs=500, optimizer=optim.SGD(perceptron.parameters(), lr=0.1))
	mlp.train_model(X, y, epochs=1000, optimizer=optim.Adam(mlp.parameters(), lr=0.01))

	vis = Visualizer(X.numpy(), y.numpy())
	fig, axes = plt.subplots(1, 2, figsize=(12, 6))

	vis.plot_decision_boundary(perceptron, "Perceptron", axes[0])
	vis.plot_decision_boundary(mlp, "MLP", axes[1])

	plt.tight_layout()
	plt.savefig("MLP_vs_Perceptron.png")
	Image.open("MLP_vs_Perceptron_chaotic.png").show()


if __name__ == "__main__":
	main()
