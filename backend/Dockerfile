FROM python:3.8-slim-buster

RUN mkdir /moodify_backend
COPY requirements.txt /moodify_backend
WORKDIR /moodify_backend

RUN pip3 install -r requirements.txt
RUN apt-get update -y

COPY . /moodify_backend

CMD [ "gunicorn", "wsgi:app", "-w 4", "-b 0.0.0.0:8080"]