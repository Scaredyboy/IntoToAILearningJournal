# Light Logic

Light logic is a game where AI creates a grid of lights, and you have to turn them on and off to match a pattern (also
created by AI).
This project was built using [SvelteKit](https://svelte.dev/).
Your task is to get this website running on your local machine and to improve it with new features.
I kept this project in one file to make it easier to use AI. In "real" projects you should split it up into multiple
files.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/)
- [Ollama in Docker](https://hub.docker.com/r/ollama/ollama)

## Getting Custom AI

We will once again be using the Ollama, and it's `Modelfile` to create a custom AI.
Look [here](https://docs.ollama.com/modelfile#modelfile-reference) for more information about the `Modelfile`.
Feel free to change the base model in the `Modelfile`.

> Make sure docker and ollama are running.

In your terminal, **go to this project's directory** and run:

```bash
# Copy the Modelfile into the container
docker cp Modelfile ollama:/tmp/Modelfile

# Enter the container
docker exec -it ollama bash

# Create your specialized model
cd /tmp

ollama create cell-crafter -f Modelfile

# Verify it was created
ollama list

# Exit container
exit
```

## Running the Svelte App

This app is built using Svelte.
To run the app, in your terminal, **go to this project's directory** and run:

```bash
npm install
npm run dev
```

Each time you make changes to the [+page.svelte](src/routes/+page.svelte) your website will automatically reload.

> Since this website calls your local AI each time it loads, it will take a while to load.

## Adding a new Feature

Now that your website is running, we will work to improve it.
All changes will be made in the [+page.svelte](src/routes/+page.svelte) file and in the [Modelfile](Modelfile).

### Improve Modelfile

Change the `Modelfile` so that it creates the patterns you want more reliably.
Currently, the AI doesn't always create a grid of the same size.
Also, sometimes the AI cheats and says you are wrong when you are correct.
Make changes to the `Modelfile` to fix these issues.

### Move Counter

Add a move counter to track player efficiency.
The move counter should be reset when a new level is loaded.

- Track how many times the player toggles a cell
- Display the current move count on the screen
- Reset the counter when a new level is loaded

> Hints: Use Svelte's `$state` rune to track moves

### Removing AI

Remove move the need for AI in `applyRule()`.
Right now each time you click the "Check Solution" button, the website is calling your local AI to check if the user
solution is correct.
We want to reduce the number of calls to the AI reducing the cost of the website.
Us AI to help you make this change.
Here is an example of what the solution might look like, **DO NOT JUST COPY THIS CODE**:

```JavaScript
function checkWin(): boolean {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (currentGrid[i][j] !== targetPattern[i][j]) {
                return false;
            }
        }
    }
    return true;
}
```

## What to turn in

Entire `light-logic` directory.
Don't just turn in single files, **turn in the whole folder** it should include:

- `+page.svelte`
- `Modelfile`

To save space, you can also remove the `node_modules` folder before zipping.
I will just run `npm install` on my end to reinstall the dependencies.