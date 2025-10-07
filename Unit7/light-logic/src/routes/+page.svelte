<script lang="ts">
    import {Ollama} from 'ollama/browser';

    const ollama = new Ollama({host: 'http://localhost:11434'});

    let currentGrid = $state<number[][]>([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]);
    let targetPattern = $state<number[][]>([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]);
    let puzzleDescription = $state('');
    let level = $state(1);
    let isLoading = $state(false);
    let gameMessage = $state('');
    let isWon = $state(false);
    let isCheckingSolution = $state(false);

    $effect(() => {
        initializeGame();
    });

    async function initializeGame() {
        isLoading = true;
        gameMessage = 'Generating new puzzle...';
        isWon = false;

        try {
            console.log('Connecting to Ollama...');
            const response = await ollama.chat({
                model: 'cell-crafter',
                messages: [
                    {
                        role: 'user',
                        content: `Generate level ${level}`
                    }
                ],
                format: 'json',
                stream: false
            });

            console.log('Received response from Ollama:', response);
            const data = JSON.parse(response.message.content);
            console.log('Parsed data:', data);

            currentGrid = JSON.parse(JSON.stringify(data.initial_grid_state));
            targetPattern = data.target_pattern;
            puzzleDescription = data.puzzle_description;
            level = data.level;
            gameMessage = '';
        } catch (error) {
            console.error('Error initializing game:', error);
            gameMessage = 'Error connecting to Ollama. Make sure Ollama is running with the cell-crafter model.';
        } finally {
            isLoading = false;
        }
    }

    function toggleCell(row: number, col: number) {
        if (isLoading || isWon || isCheckingSolution) return;
        currentGrid[row][col] = currentGrid[row][col] === 0 ? 1 : 0;
    }

    async function checkSolution() {
        if (isCheckingSolution || isLoading || isWon) return;

        isCheckingSolution = true;
        gameMessage = 'AI is checking your solution...';

        try {
            console.log('[v0] Asking AI to check solution...');
            const response = await ollama.chat({
                model: 'cell-crafter',
                messages: [
                    {
                        role: 'user',
                        content: `Check solution\nCurrent grid: ${JSON.stringify(currentGrid)}\nTarget pattern: ${JSON.stringify(targetPattern)}`
                    }
                ],
                format: 'json',
                stream: false
            });

            console.log('AI check response:', response);
            const result = JSON.parse(response.message.content);
            console.log('Parsed result:', result);

            if (result.is_correct) {
                isWon = true;
                gameMessage = result.message || '🎉 You won! The AI confirms your pattern matches!';
            } else {
                gameMessage = result.message || 'Not quite right. Keep trying!';
            }
        } catch (error) {
            console.error('Error checking solution:', error);
            gameMessage = 'Error checking solution with AI.';
        } finally {
            isCheckingSolution = false;
        }
    }

    async function nextLevel() {
        level++;
        await initializeGame();
    }

    function resetGrid() {
        initializeGame();
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
    <div class="max-w-7xl mx-auto">
        <header class="text-center mb-10">
            <h1 class="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                LightLogic
            </h1>
            <p class="text-slate-300 text-lg">AI-Powered Pattern Matching Puzzle</p>
            <div class="mt-4 inline-block bg-purple-500/20 px-6 py-2 rounded-full border border-purple-500/30">
                <span class="text-purple-300 font-semibold">Level {level}</span>
            </div>
        </header>
        <div class="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <h2 class="text-2xl font-semibold mb-4 text-purple-300">Your Grid</h2>
                <p class="text-slate-400 text-sm mb-6">Click cells to toggle them on/off</p>

                <div class="grid grid-cols-5 gap-2 mb-6">
                    {#each currentGrid as row, i}
                        {#each row as cell, j}
                            <button
                                    onclick={() => toggleCell(i, j)}
                                    disabled={isLoading || isWon || isCheckingSolution}
                                    class="aspect-square rounded-lg transition-all duration-300 border-2 {cell === 1
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 border-purple-300 shadow-lg shadow-purple-500/50'
                  : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'} {isLoading || isWon || isCheckingSolution ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}"
                                    aria-label="Cell {i},{j}"
                            ></button>
                        {/each}
                    {/each}
                </div>

                Added Check Solution button and updated button layout
                <div class="flex gap-3">
                    <button
                            onclick={checkSolution}
                            disabled={isLoading || isWon || isCheckingSolution}
                            class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                    >
                        {isCheckingSolution ? 'Checking...' : 'Check Solution'}
                    </button>
                    <button
                            onclick={resetGrid}
                            disabled={isLoading || isCheckingSolution}
                            class="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                    >
                        Reset Puzzle
                    </button>
                </div>

                {#if isWon}
                    <button
                            onclick={nextLevel}
                            class="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                    >
                        Next Level →
                    </button>
                {/if}

                {#if gameMessage}
                    <div class="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <p class="text-center text-slate-200">{gameMessage}</p>
                    </div>
                {/if}
            </div>

            <div class="space-y-6">
                <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                    <h2 class="text-2xl font-semibold mb-4 text-pink-300">Target Pattern</h2>
                    <p class="text-slate-400 text-sm mb-6">Match this pattern to win</p>

                    <div class="grid grid-cols-5 gap-2">
                        {#each targetPattern as row, i}
                            {#each row as cell, j}
                                <div
                                        class="aspect-square rounded-lg border-2 {cell === 1
                    ? 'bg-gradient-to-br from-pink-400/60 to-purple-400/60 border-pink-300/50'
                    : 'bg-slate-700/30 border-slate-600/50'}"
                                        aria-label="Target cell {i},{j}"
                                ></div>
                            {/each}
                        {/each}
                    </div>
                </div>

                {#if puzzleDescription}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                        <h2 class="text-2xl font-semibold mb-4 text-purple-300">Puzzle Hint</h2>
                        <p class="text-slate-300 leading-relaxed">
                            {puzzleDescription}
                        </p>
                    </div>
                {/if}

                <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <h3 class="text-lg font-semibold mb-3 text-purple-300">How to Play</h3>
                    <ol class="text-slate-300 text-sm space-y-2 list-decimal list-inside leading-relaxed">
                        <li>Click cells in "Your Grid" to toggle them on/off</li>
                        <li>Match the "Target Pattern" exactly</li>
                        <li>Click "Check Solution" to have the AI verify your answer</li>
                        <li>Use the puzzle hint to help you solve it</li>
                        <li>Complete levels to unlock harder challenges</li>
                    </ol>
                </div>
            </div>
        </div>

        <footer class="text-center mt-12 text-slate-400 text-sm">
            <p>Powered by Ollama • Make sure Ollama is running locally with the "cell-crafter" model</p>
        </footer>
    </div>
</div>
