<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  // Types for the Tower of Hanoi visualization
  type DiskType = {
    id: number;
    size: number; // Size is used for visual representation (larger number = wider disk)
  };

  type Move = {
    from: number; // rod index (0, 1, or 2)
    to: number;   // rod index (0, 1, or 2)
  };
  
  // Game state
  let disks: number = 3;
  let rods: DiskType[][] = [[], [], []];
  let moves: Move[] = [];
  let currentMoveIndex: number = 0;
  let isPlaying: boolean = false;
  let speed: number = 1000; // ms per move
  let totalMoves: number = 0;
  let intervalId: number | null = null;
  let startTime: number | null = null;
  
  // Initialize the game
  const initializeGame = (numDisks: number) => {
    disks = numDisks;
    rods = [Array.from({length: numDisks}, (_, i) => ({id: i, size: numDisks - i})), [], []];
    moves = calculateMoves(numDisks, 0, 2, 1);
    totalMoves = moves.length;
    currentMoveIndex = 0;
  };
  
  // Tower of Hanoi algorithm implementation
  const calculateMoves = (n: number, source: number, target: number, auxiliary: number): Move[] => {
    if (n === 1) {
      return [{ from: source, to: target }];
    }
    
    const moves: Move[] = [];
    moves.push(...calculateMoves(n - 1, source, auxiliary, target));
    moves.push({ from: source, to: target });
    moves.push(...calculateMoves(n - 1, auxiliary, target, source));
    
    return moves;
  };
  
  // Execute the next move
  const executeMove = () => {
    if (currentMoveIndex >= moves.length) {
      isPlaying = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      return;
    }
    
    const move = moves[currentMoveIndex];
    const disk = rods[move.from].pop();
    
    if (disk) {
      rods[move.to] = [...rods[move.to], disk];
    }
    
    currentMoveIndex++;
  };
  
  // Start the animation
  const startAnimation = () => {
    if (moves.length > 0 && currentMoveIndex < moves.length && !isPlaying) {
      isPlaying = true;
      if (!startTime) {
        startTime = Date.now();
      }
      intervalId = window.setInterval(() => {
        executeMove();
        if (currentMoveIndex >= moves.length) {
          stopAnimation();
        }
      }, speed);
    }
  };
  
  // Stop the animation
  const stopAnimation = () => {
    isPlaying = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  // Reset the game
  const resetGame = () => {
    stopAnimation();
    startTime = null;
    initializeGame(disks);
  };
  
  // Step forward
  const stepForward = () => {
    if (currentMoveIndex < moves.length) {
      executeMove();
    }
  };
  
  // Step backward
  const stepBackward = () => {
    if (currentMoveIndex > 0) {
      currentMoveIndex--;
      const move = moves[currentMoveIndex];
      const disk = rods[move.to].pop();
      
      if (disk) {
        rods[move.from] = [...rods[move.from], disk];
      }
    }
  };
  
  // Update speed value
  const updateSpeed = (newSpeed: number) => {
    speed = newSpeed;
    if (isPlaying) {
      stopAnimation();
      startAnimation();
    }
  };
  
  // Update number of disks
  const updateDisks = (newDisks: number) => {
    initializeGame(newDisks);
  };
  
  // Initialize the game on component mount
  onMount(() => {
    initializeGame(disks);
  });
  
  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
  
  // Speed options
  const speedOptions = [
    { label: 'Slow', value: 2000 },
    { label: 'Medium', value: 1000 },
    { label: 'Fast', value: 500 },
    { label: 'Very Fast', value: 200 }
  ];
  
  // Calculate algorithm complexity
  $: complexity = `O(2^${disks}) = O(${Math.pow(2, disks)})`;
  
  // Calculate progress percentage
  $: progress = totalMoves > 0 ? Math.round((currentMoveIndex / totalMoves) * 100) : 0;
  
  // Format time as MM:SS
  $: formattedTime = startTime ? new Date(Math.floor((Date.now() - startTime) / 1000) * 1000).toISOString().substr(14, 5) : '00:00';
  
  // Calculate color based on disk size for better visual distinction
  const getColor = (size: number, total: number) => {
    const hue = (size * 360) / total;
    return `hsl(${hue}, 80%, 50%)`;
  };
  
  // Calculate rod position for styling
  const getPosition = (index: number) => {
    const positions = ['left', 'center', 'right'];
    return positions[index] || 'center';
  };
  
  // Handle speed change with proper typing
  function handleSpeedChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    updateSpeed(parseInt(target.value));
  }
</script>

<main>
  <h1>Tower of Hanoi Visualization</h1>
  
  <div class="tower-of-hanoi-container">
    <div class="visualization-area">
      {#each [0, 1, 2] as rodIndex}
        <div class="rod" class:position={getPosition(rodIndex)}>
          <div class="rod-pole"></div>
          <div class="rod-base"></div>
          <div class="disks-container">
            {#each rods[rodIndex] as disk, diskIndex}
              <div 
                class="disk"
                style={`background-color: ${getColor(disk.size, disks)}; width: ${disk.size * 20}px;`}
              >
                <span class="disk-label">{disk.size}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    
    <div class="controls-area">
      <div class="controls">
        <div class="control-group">
          <label for="disk-count">Number of Disks: {disks}</label>
          <input 
            id="disk-count"
            type="range" 
            min="3" 
            max="10" 
            bind:value={disks}
            on:change={() => initializeGame(disks)}
          />
        </div>
        
        <div class="control-group">
          <label for="speed">Speed:</label>
          <select id="speed" on:change={handleSpeedChange}>
            {#each speedOptions as option}
              <option value={option.value} selected={option.value === speed}>
                {option.label}
              </option>
            {/each}
          </select>
        </div>
        
        <div class="control-group buttons">
          <button 
            class="btn" 
            class:playing={isPlaying}
            on:click={isPlaying ? stopAnimation : startAnimation}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button 
            class="btn" 
            class:disabled={currentMoveIndex <= 0}
            disabled={currentMoveIndex <= 0}
            on:click={stepBackward}
          >
            ← Step Back
          </button>
          
          <button 
            class="btn" 
            class:disabled={currentMoveIndex >= totalMoves}
            disabled={currentMoveIndex >= totalMoves}
            on:click={stepForward}
          >
            Step Forward →
          </button>
          
          <button class="btn" on:click={resetGame}>Reset</button>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <h3>Current Step</h3>
          <p>{currentMoveIndex} / {totalMoves}</p>
        </div>
        
        <div class="stat-item">
          <h3>Disks</h3>
          <p>{disks}</p>
        </div>
        
        <div class="stat-item">
          <h3>Algorithm Complexity</h3>
          <p>{complexity}</p>
        </div>
        
        <div class="stat-item">
          <h3>Time Elapsed</h3>
          <p>{formattedTime}</p>
        </div>
        
        <div class="stat-item">
          <h3>Progress</h3>
          <div class="progress-bar">
            <div class="progress" style={`width: ${progress}%`}></div>
          </div>
          <p>{progress}%</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  :root {
    --primary-color: #4CAF50;
    --secondary-color: #2196F3;
    --accent-color: #FF9800;
    --background-color: #f9f9f9;
    --text-color: #333;
    --border-color: #ddd;
    --rod-color: #555;
    --rod-base-color: #777;
    --disk-hue-start: 0;
    --disk-hue-end: 300;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  main {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: var(--primary-color);
    margin-top: 0;
    font-size: 2.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .tower-of-hanoi-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    min-height: 100vh;
  }
  
  .visualization-area {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 60vh;
    width: 100%;
    padding: 2rem 0;
    border-bottom: 2px solid var(--border-color);
    background: linear-gradient(to bottom, #e0f7fa, #ffffff);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .controls-area {
    width: 100%;
    max-width: 800px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Rod styling */
  .rod {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100%;
    width: 150px;
  }

  .rod-pole {
    width: 12px;
    height: 80%;
    background-color: var(--rod-color);
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .rod-base {
    width: 160px;
    height: 20px;
    background-color: var(--rod-base-color);
    border-radius: 4px;
    margin-top: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .disks-container {
    position: absolute;
    bottom: 25px;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  /* Disk styling */
  .disk {
    height: 25px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: transform 0.3s ease, left 0.3s ease;
    position: relative;
    z-index: 1;
    min-width: 40px;
  }

  .disk-label {
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  }

  /* Controls styling */
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .control-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 150px;
  }

  .control-group label {
    font-weight: bold;
    color: var(--text-color);
  }

  .control-group input[type="range"] {
    width: 150px;
  }

  .control-group select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    background-color: white;
    min-width: 100px;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    width: 100%;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
    transition: all 0.3s;
    flex: 1;
    min-width: 100px;
    max-width: 120px;
  }

  .btn:hover:not(.disabled) {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .btn:active:not(.disabled) {
    transform: translateY(0);
  }

  .btn.playing {
    background-color: #f44336;
  }

  .btn.playing:hover {
    background-color: #d32f2f;
  }

  .btn.disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Stats styling */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background-color: #e8f4fd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .stat-item {
    text-align: center;
    padding: 0.5rem;
  }

  .stat-item h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 600;
  }

  .stat-item p {
    margin: 0.25rem 0;
    font-weight: bold;
    color: #2c3e50;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background-color: #ddd;
    border-radius: 10px;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .progress {
    height: 100%;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    transition: width 0.3s ease;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .tower-of-hanoi-container {
      padding: 0.5rem;
    }
    
    h1 {
      font-size: 1.8rem;
    }
    
    .visualization-area {
      height: 50vh;
      padding: 1rem 0;
    }
    
    .rod {
      width: 100px;
    }
    
    .rod-pole {
      width: 8px;
    }
    
    .rod-base {
      width: 110px;
    }
    
    .controls {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    
    .buttons {
      gap: 0.5rem;
    }
    
    .btn {
      min-width: 80px;
      padding: 0.6rem;
      font-size: 0.9rem;
    }
    
    .stats {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.5rem;
    }
    
    .visualization-area {
      height: 40vh;
    }
    
    .disk {
      height: 20px;
    }
    
    .disk-label {
      font-size: 0.7rem;
    }
    
    .rod {
      width: 80px;
    }
    
    .rod-pole {
      width: 6px;
    }
    
    .rod-base {
      width: 90px;
    }
    
    .control-group {
      width: 100%;
    }
    
    .control-group input[type="range"] {
      width: 100%;
    }
  }
</style>