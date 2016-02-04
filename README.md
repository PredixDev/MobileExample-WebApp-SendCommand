# MobileExample-WebApp-SendCommand
A sample webapp which sends a sample command to backend and displays the response.

## Before You Begin:
It is assumed that you already have running instances of [_Predix Mobile cloud services_](https://www.predix.io/docs#rae4EfJ6) and pushed your [_command-processor_](https://github.com/PredixDev/MobileExample-Microservice-CommandProcessor) to your CF space (or running on your development system).  

## Configuration

Update `commandRoute` variable in `MobileCommand.js` file to the url registered using _PM CLI_ tool (ex. `pm add-route <command-route> <processor-url>`) .

## Installation

Checkout this repository, open the folder in a terminal window, and execute:

```
pm publish
```

## Usage
Press _Send Command_ button once to see name of logged-in user. Tap again to send a test command. Status area and text area will display status of command.
