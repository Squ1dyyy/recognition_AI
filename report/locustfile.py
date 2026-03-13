from locust import HttpUser, task, between
import copy

BASE_PAYLOAD = {
	"image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAbklEQVR4AeyVMQoAIAhF/d3/zlaDDdIgKk4fClPKV29piYhOzgs8vLmRAqqq3Jm5ZgqYAdkZAs1EW6TSNpXWiErNRFuk0q9KAN96pFhSmvkxSsDIi/weAr2Rck6lZYW+AZV6Iy8HIABeHl2MK90AAAD//794inoAAAAGSURBVAMAZ40lHXKLkDkAAAAASUVORK5CYII=",
	"models": ["CNN"],
	"target": None
}

HEADERS = {
	"Content-Type": "application/json"
}


class ApiUser(HttpUser):
	host = "http://127.0.0.1:8000"
	wait_time = between(0.01, 0.2)

	@task(1)
	def recognize_perceptron(self):
		payload = copy.deepcopy(BASE_PAYLOAD)
		payload["models"] = ["Perceptron"]
		self.client.post("/api/recognize", json=payload, headers=HEADERS, name="POST /api/recognize Perceptron")

	@task(1)
	def recognize_mlp(self):
		payload = copy.deepcopy(BASE_PAYLOAD)
		payload["models"] = ["MLP"]
		self.client.post("/api/recognize", json=payload, headers=HEADERS, name="POST /api/recognize MLP")

	@task(1)
	def recognize_cnn_mlp(self):
		payload = copy.deepcopy(BASE_PAYLOAD)
		payload["models"] = ["CNN", "MLP"]
		self.client.post("/api/recognize", json=payload, headers=HEADERS, name="POST /api/recognize CNN+MLP")

	@task(5)
	def index(self):
		self.client.get("/", name="GET /")
	# @task(1)
	# def test_speed(self):
	# 	self.client.get("/test/", name="GET /")