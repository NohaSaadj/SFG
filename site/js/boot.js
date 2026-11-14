/* Runs in <head>, before first paint: lets CSS hide what the scripts will reveal (no flash of unrevealed content). */
document.documentElement.classList.add("js");
