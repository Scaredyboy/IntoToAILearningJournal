<script>
    import ollama from 'ollama';

    let emailBody = $state('');
    let subjects = $state(['', '', '']);
    let loading = $state(false);
    let error = $state('');
    let copied = $state([false, false, false]);

    async function generate() {
        if (!emailBody.trim()) return;

        loading = true;
        error = '';
        subjects = ['', '', ''];

        try {
            let data = await ollama.chat({
                //you might have to change the model name
                model: 'email-guru',
                messages: [{role: 'user', content: emailBody}],
            });
            console.log('Full Ollama response:', data);

            if (data && data.message && data.message.content) {
                const content = data.message.content.trim();
                console.log('Message content:', content);

                // Split the content by lines and filter out empty lines
                const lines = content.split('\n').filter(line => line.trim());
                console.log('Parsed lines:', lines);

                // Take up to 3 lines as subject lines, clean them up
                const parsedSubjects = lines.slice(0, 3).map(line => {
                    // Remove common prefixes like "1.", "2.", "3.", "-", "*", etc.
                    return line.replace(/^[\d\.\-\*\s]+/, '').trim();
                });

                console.log('Final subjects:', parsedSubjects);

                // Ensure we have exactly 3 subjects (pad with empty strings if needed)
                subjects = [
                    parsedSubjects[0] || '',
                    parsedSubjects[1] || '',
                    parsedSubjects[2] || ''
                ];
            } else {
                error = 'Invalid response format from Ollama';
                console.error('Invalid response structure:', data);
            }

        } catch (err) {
            error = err.message;
            console.error('Ollama connection error:', err);
        } finally {
            loading = false;
        }
    }

    async function copy(text, index) {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            copied[index] = true;
            setTimeout(() => {
                copied[index] = false;
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    function handleKeydown(event) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            generate();
        }
    }
</script>


<main class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto px-6 py-12 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4 text-balance">
                Email Subject Generator
            </h1>
            <p class="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                Transform your email content into compelling subject lines using AI.
                Powered by your custom Ollama email-guru model.
            </p>
        </div>

        <!-- Main Content -->
        <div class="grid lg:grid-cols-2 gap-8">
            <!-- Input Section -->
            <div class="space-y-6">
                <div class="bg-card border border-border rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold">Email Content</h2>
                        <div class="text-sm text-muted-foreground">
                            ⌘ + Enter to generate
                        </div>
                    </div>

                    <textarea
                            bind:value={emailBody}
                            onkeydown={handleKeydown}
                            placeholder="Write your email content here... The AI will analyze your message and generate compelling subject lines that capture the essence of your email."
                            class="w-full h-80 p-4 bg-input border border-border rounded-lg resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    ></textarea>

                    <button
                            onclick={generate}
                            disabled={!emailBody.trim() || loading}
                            class="w-full mt-4 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        {#if loading}
                            <div class="flex items-center justify-center gap-2">
                                <div class="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                                Generating subjects...
                            </div>
                        {:else}
                            Generate Subject Lines
                        {/if}
                    </button>

                    {#if error}
                        <div class="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p class="text-destructive text-sm">{error}</p>
                            <p class="text-muted-foreground text-xs mt-1">
                                Make sure Ollama is running with the email-guru model loaded.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Output Section -->
            <div class="space-y-6">
                <h2 class="text-xl font-semibold">Generated Subject Lines</h2>

                <div class="space-y-4">
                    {#each subjects as subject, i}
                        <div class="bg-card border border-border rounded-xl p-6 transition-all duration-200 hover:border-accent/50">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm text-muted-foreground mb-2">
                                        Option {i + 1}
                                    </div>
                                    <div class="text-foreground font-medium leading-relaxed">
                                        {subject || 'Subject line will appear here...'}
                                    </div>
                                </div>

                                {#if subject}
                                    <button
                                            onclick={() => copy(subject, i)}
                                            class="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors duration-200 group"
                                            aria-label="Copy subject line {i + 1}"
                                    >
                                        {#if copied[i]}
                                            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        {:else}
                                            <svg class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                        {/if}
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="bg-muted/30 border border-border rounded-xl p-6">
                    <h3 class="font-medium mb-3">💡 Tips for better results</h3>
                    <ul class="text-sm text-muted-foreground space-y-2">
                        <li>• Include key details about your email's purpose</li>
                        <li>• Mention any urgency or time-sensitive information</li>
                        <li>• Specify your target audience when relevant</li>
                        <li>• Keep your email content clear and focused</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>
