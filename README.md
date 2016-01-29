# MobileExample-WebApp-SendCommand(v0.1)
A sample webapp which sends a sample command to backend and displays the response.

## Configuration

Update `commandRoute` variable in `MobileCommand.js` file to the uri registered using _PM CLI_ tool (ex. `pm add-route <command-route> <processor-url>`) .

## Installation

Checkout this repository, open the folder in a terminal window, and execute:

```
pm publish
```

## Usage
Press _Send Command_ button once to see name of logged-in user. Tap again to send a test command. Status area and text area displays what it is doing.
