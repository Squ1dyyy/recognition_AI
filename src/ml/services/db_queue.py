import queue
import threading
import time
from typing import Dict, List, Any

from django.db import close_old_connections

from api_v1.models import Canvas

DB_QUEUE: queue.Queue[Dict[str, Any]] = queue.Queue(maxsize=5000)
BATCH_SIZE: int = 128
FLUSH_INTERVAL: int = 1


def db_worker(worker_id: int) -> None:
	"""Consume prediction results from the queue and bulk-insert into DB."""
	batch: List[Canvas] = []
	last_flush: float = time.time()

	while True:
		try:
			try:
				data: Dict[str, Any] = DB_QUEUE.get(timeout=FLUSH_INTERVAL)
				batch.append(Canvas(**data))
				DB_QUEUE.task_done()
			except queue.Empty:
				pass

			if len(batch) >= BATCH_SIZE or (batch and time.time() - last_flush >= FLUSH_INTERVAL):
				close_old_connections()

				try:
					Canvas.objects.bulk_create(batch, batch_size=BATCH_SIZE)
				except Exception as e:
					print(f"[Worker {worker_id}] Error on bulk_create: {e}")
				batch.clear()
				last_flush = time.time()

		except Exception as e:
			print(f"[Worker {worker_id}] Unexpected error: {e}")
			batch.clear()
			last_flush = time.time()


def start_db_workers(n: int = 2) -> None:
	"""Spawn daemon threads that flush the DB queue in batches."""
	for i in range(n):
		t: threading.Thread = threading.Thread(target=db_worker, args=(i,), daemon=True)
		t.start()
