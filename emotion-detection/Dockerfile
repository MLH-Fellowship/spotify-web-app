FROM python:3.8-slim-buster

RUN mkdir /emotion_model
COPY requirements.txt /emotion_model
WORKDIR /emotion_model

RUN pip3 install --no-cache-dir -r requirements.txt
RUN apt-get update -y
RUN apt install -y libgl1-mesa-glx libglib2.0-0 libglu1-mesa

COPY . /emotion_model

CMD [ "gunicorn", "wsgi:app", "-w 2", "-b 0.0.0.0:5001"]