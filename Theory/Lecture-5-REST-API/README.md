# Lecture 5: RESTful APIs and FastAPI

This project completes the Lecture 5 FastAPI CRUD task and the Course-resource lab exercise.

## Included resources

| Resource | Routes | Features |
| --- | --- | --- |
| Students | `/api/v1/students` | GET, GET by ID, POST, PUT, DELETE; `branch` filter |
| Courses | `/api/v1/courses` | GET, GET by ID, POST, PUT, DELETE; `department` filter |

Both collection endpoints support `page` and `limit` query parameters. FastAPI validates incorrect bodies and returns `422 Unprocessable Entity`; missing resources return `404 Not Found`; creates return `201 Created`; deletes return `204 No Content`.

## Install and run

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

If PowerShell blocks activation, do not change your execution policy. Run the virtual environment's Python directly:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe main.py
```

Open these URLs while the server is running:

- Swagger UI: `http://127.0.0.1:5000/docs`
- ReDoc: `http://127.0.0.1:5000/redoc`
- API root: `http://127.0.0.1:5000/`

## Example requests

```powershell
curl http://127.0.0.1:5000/api/v1/students
curl "http://127.0.0.1:5000/api/v1/courses?department=CSE"
curl -Method Post http://127.0.0.1:5000/api/v1/courses -ContentType "application/json" -Body '{"title":"Computer Networks","credits":4,"department":"CSE"}'
```

The data is intentionally kept in memory for the lecture demonstration. Restarting the server resets it to the sample resources.
