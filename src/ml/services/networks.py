from typing import Dict, Type

from torch import nn, Tensor


REGISTRY: Dict[str, Type[nn.Module]] = {}


def register(name: str):
	"""Class decorator that registers a model in the global registry."""
	def wrapper(cls: Type[nn.Module]) -> Type[nn.Module]:
		REGISTRY[name] = cls
		return cls
	return wrapper


@register("MLP")
class MLP(nn.Module):
	"""Multi-layer perceptron: 784 -> 128 -> 128 -> 11."""

	def __init__(self) -> None:
		super().__init__()
		self.fc1: nn.Linear = nn.Linear(784, 128)
		self.fc2: nn.Linear = nn.Linear(128, 128)
		self.fc3: nn.Linear = nn.Linear(128, 11)
		self.relu: nn.ReLU = nn.ReLU()
		self.activations: Dict[str, Tensor] = {}

	def forward(self, x: Tensor) -> Tensor:
		x = x.view(x.size(0), -1)
		x = self.relu(self.fc1(x))
		self.activations["hidden_layer_1"] = x
		x = self.relu(self.fc2(x))
		self.activations["hidden_layer_2"] = x
		x = self.fc3(x)
		self.activations["output"] = x
		return x


@register("Perceptron")
class Perceptron(nn.Module):
	"""Single-layer perceptron: 784 -> 11."""

	def __init__(self) -> None:
		super().__init__()
		self.func1: nn.Linear = nn.Linear(784, 11)
		self.activations: Dict[str, Tensor] = {}

	def forward(self, x: Tensor) -> Tensor:
		x = x.view(x.size(0), -1)
		self.activations["output"] = self.func1(x)
		return self.func1(x)


@register("CNN")
class CNN(nn.Module):
	"""Convolutional neural network for 28x28 grayscale images."""

	def __init__(self) -> None:
		super().__init__()
		self.conv1: nn.Conv2d = nn.Conv2d(1, 32, kernel_size=3, padding=1)
		self.conv2: nn.Conv2d = nn.Conv2d(32, 64, kernel_size=3, padding=1)
		self.pool: nn.MaxPool2d = nn.MaxPool2d(2, 2)
		self.fc1: nn.Linear = nn.Linear(64 * 7 * 7, 128)
		self.dropout: nn.Dropout = nn.Dropout(0.3)
		self.fc2: nn.Linear = nn.Linear(128, 11)
		self.relu: nn.ReLU = nn.ReLU()
		self.activations: Dict[str, Tensor] = {}

		for layer in [self.conv1, self.conv2, self.fc1, self.fc2]:
			if hasattr(layer, 'weight'):
				nn.init.xavier_uniform_(layer.weight)

	def forward(self, x: Tensor) -> Tensor:
		if x.dim() == 2 and x.size(1) == 784:
			x = x.view(-1, 1, 28, 28)

		x = self.relu(self.conv1(x))
		self.activations["conv1"] = x
		x = self.pool(x)
		self.activations["pool1"] = x

		x = self.relu(self.conv2(x))
		self.activations["conv2"] = x
		x = self.pool(x)
		self.activations["pool2"] = x

		x = x.view(x.size(0), -1)
		x = self.relu(self.fc1(x))
		self.activations["fc1"] = x
		x = self.dropout(x)
		self.activations["dropout"] = x

		x = self.fc2(x)
		self.activations["output"] = x
		return x
