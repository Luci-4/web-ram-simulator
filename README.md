# Web-based Random-Access Machine Emulator
The Web-based Random-Access Machine (RAM) Emulator allows you to emulate and execute programs written for a Random-Access Machine. The emulator's core is written in TypeScript, and the application itself is built using pure HTML, CSS, and JavaScript. The application is hosted at [random-access-machine-emulator.netlify.app](https://random-access-machine-emulator.netlify.app/)

## Features

- RAM Emulation: The emulator accurately emulates the behavior of a Random-Access Machine, allowing you to execute RAM programs.
- Program Execution: You can load RAM programs into the emulator and execute them, step-by-step or continuously, to observe the machine's behavior.
- Input/Output Handling: The emulator allows you to input values into the machine and view the output produced by the executed RAM program.
- Code Editor: The application includes a code editor where you can write and modify RAM programs directly within the web browser.
- Syntax Completions: The code editor provides syntax completion for RAM program commands, to facilitate a more user-friendly experience.

## Usage

To use the Web-based RAM Emulator, follow the steps below:

1. Open the Web Application: Open the emulator in a web browser that supports HTML, CSS, and JavaScript.

2. Write or Load a RAM Program: Use the provided code editor to write a RAM program directly in the browser or load an existing RAM program file.

3. Provide Input Values (if applicable): If your RAM program requires input values, enter them in the designated input fields or follow the instructions provided on the website.

4. Emulate the RAM Program: Start the RAM program emulation by clicking the "Run" or "Debug" button. Use the provided controls to step through the program execution or let it run continuously.

5. Analyze the Results: Once the program execution completes or reaches a breakpoint, review the final memory and register states. Use this information to analyze the behavior and output of the RAM program.

7. Modify and Rerun: Modify the RAM program code or input values as needed, then rerun the emulation to observe different program outcomes.

## Supported Commands

| Command | Description |
|---------|-------------|
| READ    | Reads a value from input and stores it in a register. |
| LOAD    | Loads a value from memory into a register. |
| STORE   | Stores the value from a register into memory. |
| ADD     | Adds the value from a register to the value in another register or memory location. |
| SUB     | Subtracts the value from a register or memory location from the value in another register. |
| MULT    | Multiplies the value from a register with the value in another register or memory location. |
| DIV     | Divides the value in a register by the value from another register or memory location. |
| JUMP    | Unconditionally jumps to a specified label in the program. |
| JGTZ    | Jumps to a specified label if the value in a register is greater than zero. |
| JZERO   | Jumps to a specified label if the value in a register is zero. |
| WRITE   | Writes the value from a register or memory location to output. |
| HALT    | Stops program execution. |

For the arguments, the following formats are supported:

- **Address**: (a number with no prefix)
- **Value**: (a number with `=` prefix)
- **Pointer**: (a number with `^` prefix)
- **Label**: (a string of text)
## Example Program

Here's an example RAM program that calculates the factorial of a number:

```
READ 1
LOAD 1
STORE 2

LOOP LOAD 2
	SUB =1
	JZERO END
	STORE 2

	LOAD 1
	MULT 2
	STORE 1
JUMP LOOP
END WRITE 1
HALT
```

Feel free to modify and experiment with this example program or create your own RAM programs using the emulator.
