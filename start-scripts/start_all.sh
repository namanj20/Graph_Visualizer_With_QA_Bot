#!/bin/bash

(cd ../backend && python3 app.py) &
(cd ../frontend && npm start)
