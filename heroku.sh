#!/bin/bash
gunicorn app:app
python worker.py