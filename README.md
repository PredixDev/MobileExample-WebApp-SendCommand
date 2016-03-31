# MobileExample-WebApp-SendCommand
This sample web app sends a command to backend and displays the response.

## Before You Begin:
It is assumed that you already have running instances of [_Predix Mobile service_](https://www.predix.io/docs#rae4EfJ6) and pushed your [_command-processor_](https://github.com/PredixDev/MobileExample-Microservice-CommandProcessor) to your CF space (or running on your development system).  

## Configuration

Update the `commandRoute` variable in `MobileCommand.js` file to the URL registered using _PM CLI_ tool (ex. `pm add-route <command-route> <processor-url>`).

## Installation

Checkout this repository, open the folder in a terminal window, and execute:

```
pm publish
```

## Usage
Press _Send Command_ button once to see name of logged in user. Tap again to send a test command. The Status area and Text area display status of command.
