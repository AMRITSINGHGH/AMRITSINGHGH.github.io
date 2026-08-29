"""Lecture 5: RESTful Student and Course APIs built with FastAPI."""

from typing import Annotated

import uvicorn
from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field

app = FastAPI(
    title="Lecture 5 REST API",
    version="1.0.0",
    description="CRUD APIs for Students and Courses. Explore and test them at /docs.",
)


class StudentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=60, examples=["Priya"])
    branch: str = Field(min_length=2, max_length=20, examples=["CSE"])


class Student(StudentCreate):
    id: int


class CourseCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100, examples=["Web Development"])
    credits: int = Field(ge=1, le=10, examples=[4])
    department: str = Field(min_length=2, max_length=40, examples=["CSE"])


class Course(CourseCreate):
    id: int


students = [
    Student(id=1, name="Aarav", branch="CSE"),
    Student(id=2, name="Diya", branch="ECE"),
    Student(id=3, name="Rohan", branch="IT"),
]
courses = [
    Course(id=1, title="Data Structures", credits=4, department="CSE"),
    Course(id=2, title="Digital Electronics", credits=3, department="ECE"),
    Course(id=3, title="Database Systems", credits=4, department="CSE"),
]
next_student_id = 4
next_course_id = 4

Page = Annotated[int, Query(ge=1, description="Page number, beginning at 1")]
Limit = Annotated[int, Query(ge=1, le=100, description="Maximum resources per page")]


def find_by_id(resources: list[Student] | list[Course], resource_id: int):
    for index, resource in enumerate(resources):
        if resource.id == resource_id:
            return index, resource
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")


@app.get("/", tags=["Info"])
def root():
    return {"message": "Lecture 5 REST API", "docs": "/docs", "resources": ["/api/v1/students", "/api/v1/courses"]}


@app.get("/api/v1/students", response_model=list[Student], tags=["Students"])
def list_students(branch: str | None = None, page: Page = 1, limit: Limit = 20):
    """List students; optionally filter with `?branch=CSE` and paginate."""
    filtered = students if branch is None else [student for student in students if student.branch.casefold() == branch.casefold()]
    start = (page - 1) * limit
    return filtered[start:start + limit]


@app.get("/api/v1/students/{student_id}", response_model=Student, tags=["Students"])
def get_student(student_id: int):
    return find_by_id(students, student_id)[1]


@app.post("/api/v1/students", response_model=Student, status_code=status.HTTP_201_CREATED, tags=["Students"])
def create_student(student: StudentCreate):
    global next_student_id
    created = Student(id=next_student_id, **student.model_dump())
    students.append(created)
    next_student_id += 1
    return created


@app.put("/api/v1/students/{student_id}", response_model=Student, tags=["Students"])
def update_student(student_id: int, student: StudentCreate):
    index, _ = find_by_id(students, student_id)
    updated = Student(id=student_id, **student.model_dump())
    students[index] = updated
    return updated


@app.delete("/api/v1/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Students"])
def delete_student(student_id: int):
    index, _ = find_by_id(students, student_id)
    students.pop(index)


@app.get("/api/v1/courses", response_model=list[Course], tags=["Courses"])
def list_courses(department: str | None = None, page: Page = 1, limit: Limit = 20):
    """Lab exercise: list courses and filter with `?department=CSE`."""
    filtered = courses if department is None else [course for course in courses if course.department.casefold() == department.casefold()]
    start = (page - 1) * limit
    return filtered[start:start + limit]


@app.get("/api/v1/courses/{course_id}", response_model=Course, tags=["Courses"])
def get_course(course_id: int):
    return find_by_id(courses, course_id)[1]


@app.post("/api/v1/courses", response_model=Course, status_code=status.HTTP_201_CREATED, tags=["Courses"])
def create_course(course: CourseCreate):
    global next_course_id
    created = Course(id=next_course_id, **course.model_dump())
    courses.append(created)
    next_course_id += 1
    return created


@app.put("/api/v1/courses/{course_id}", response_model=Course, tags=["Courses"])
def update_course(course_id: int, course: CourseCreate):
    index, _ = find_by_id(courses, course_id)
    updated = Course(id=course_id, **course.model_dump())
    courses[index] = updated
    return updated


@app.delete("/api/v1/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Courses"])
def delete_course(course_id: int):
    index, _ = find_by_id(courses, course_id)
    courses.pop(index)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
