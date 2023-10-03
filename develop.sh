#!/usr/bin/env bash

session_name="puppetviewer"

tmux new-session -d -s "${session_name}"

tmux new-window -d -n "puppetviewer-backend" "zsh -c 'make develop-backend; zsh'"
tmux new-window -d -n "puppetviewer-frontend" "zsh -c 'make develop-frontend; zsh'"

tmux kill-window -t 0

tmux attach -t "${session_name}"
