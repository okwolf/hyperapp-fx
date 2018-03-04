import {
  ACTION,
  FRAME,
  DELAY,
  TIME,
  LOG,
  HTTP,
  EVENT,
  KEY_DOWN,
  KEY_UP,
  RANDOM,
  DEBOUNCE,
  THROTTLE
} from "./fxTypes"

export function action(name, data) {
  return [
    ACTION,
    {
      name: name,
      data: data
    }
  ]
}

export function frame(action) {
  return [
    FRAME,
    {
      action: action
    }
  ]
}

export function delay(duration, action, data) {
  return [
    DELAY,
    {
      duration: duration,
      action: action,
      data: data
    }
  ]
}

export function time(action) {
  return [
    TIME,
    {
      action: action
    }
  ]
}

export function log() {
  return [
    LOG,
    {
      args: arguments
    }
  ]
}

export function http(url, action, options) {
  return [
    HTTP,
    {
      url: url,
      action: action,
      options: options
    }
  ]
}

export function event(action) {
  return [
    EVENT,
    {
      action: action
    }
  ]
}

export function keydown(action) {
  return [
    KEY_DOWN,
    {
      action: action
    }
  ]
}

export function keyup(action) {
  return [
    KEY_UP,
    {
      action: action
    }
  ]
}

export function random(action, min, max) {
  return [
    RANDOM,
    {
      action: action,
      min: min || 0,
      max: max || 1
    }
  ]
}

export function debounce (wait, action, data) {
  return [
    DEBOUNCE,
    {
      wait: wait,
      action: action,
      data: data
    }
  ]
}

export function throttle (rate, action, data) {
  return [
    THROTTLE,
    {
      rate,
      action,
      data
    }
  ]
}
